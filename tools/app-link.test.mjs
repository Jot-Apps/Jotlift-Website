/* Every "Get the app" and "Subscribe in the app" button reaches the App Store.
 *
 * CHECKED IN A REAL BROWSER, and twice: once with JavaScript on, once with it
 * off. Both runs matter, and for different reasons.
 *
 * With JavaScript off is the one that would rot quietly. `applyAppLink()`
 * rewrites every [data-app-link] href on load, so a page whose own href was
 * left pointing at the old fallback still looks correct in a normal browser
 * and is a dead end for every reader who blocks scripts. The pages are meant
 * to work without JavaScript, so the href in the HTML has to be right on its
 * own, not right once a module has fixed it.
 *
 * With JavaScript on covers the other half: the dashboard builds its upgrade
 * button at runtime, so it exists in no HTML file and can only be looked at
 * after the module has rendered.
 *
 *   node tools/app-link.test.mjs
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { APP_STORE_URL } from '../assets/js/app-link.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = 8138;

// Every public route. A button can only be checked on a page that is served,
// so a new page with a CTA on it belongs in this list.
const PAGES = [
  '/',
  '/how-it-works/',
  '/pricing/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/delete/',
  '/404.html',
];

// Where a CTA has to exist. The rest of PAGES may carry none, but if these
// ever stop offering a way to the store, that is the regression.
const MUST_HAVE_ONE = ['/', '/how-it-works/', '/pricing/'];

let failures = 0;
const check = (ok, label, extra = '') => {
  if (!ok) {
    failures += 1;
    console.log(`  ✗ ${label}${extra ? ` — ${extra}` : ''}`);
  } else {
    console.log(`  ✓ ${label}`);
  }
};

/* ----------------------------------------------------------- static server */

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.csv': 'text/csv',
};

// The repository as GitHub Pages serves it: files straight off disk.
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  let rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  if (rel.endsWith('/')) rel += 'index.html';
  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

/* ------------------------------------------------------------- 1. the URL */

console.log('\n— the listing —');
{
  let url = null;
  try {
    url = new URL(APP_STORE_URL);
  } catch {
    /* left null, reported below */
  }
  check(url !== null, 'APP_STORE_URL is a URL', String(APP_STORE_URL));
  check(url?.protocol === 'https:', 'it is https');
  check(url?.hostname === 'apps.apple.com', 'it is an App Store link', url?.hostname);
  // The numeric id is the part that actually resolves the listing; the slug
  // before it is decoration Apple ignores. A typo here is the whole failure.
  check(/\/id\d+$/.test(url?.pathname ?? ''), 'it ends in an app id', url?.pathname);
}

/* ------------------------------------------------------- 2. the CTAs, twice */

const browser = await chromium.launch();

// The pages ask Google for their fonts. Nothing here is testing a font, and a
// test that waits on the network is a test that fails for reasons that have
// nothing to do with the thing it checks, so every off-harness request is
// refused and the page carries on with a fallback face.
const offline = async (ctx) => {
  await ctx.route('**/*', (route) =>
    route.request().url().startsWith(`http://127.0.0.1:${PORT}`) ? route.continue() : route.abort(),
  );
  return ctx;
};

for (const javaScriptEnabled of [true, false]) {
  console.log(`\n— the buttons, JavaScript ${javaScriptEnabled ? 'on' : 'off'} —`);
  const ctx = await offline(await browser.newContext({ javaScriptEnabled }));
  const page = await ctx.newPage();

  for (const route of PAGES) {
    await page.goto(`http://127.0.0.1:${PORT}${route}`);
    // With JavaScript on, applyAppLink() runs from a module, so the hrefs are
    // only settled once the module has. Without this the run would be reading
    // the HTML's own href twice and the second pass would prove nothing.
    if (javaScriptEnabled) await page.waitForLoadState('networkidle');
    const hrefs = await page.$$eval('[data-app-link]', (nodes) =>
      // The attribute rather than the property, so a relative leftover shows up
      // as what it is instead of being resolved against the page it sits on.
      nodes.map((n) => n.getAttribute('href')),
    );

    if (MUST_HAVE_ONE.includes(route)) {
      check(hrefs.length > 0, `${route} offers a way to the app`, `${hrefs.length} found`);
    }
    const wrong = hrefs.filter((h) => h !== APP_STORE_URL);
    check(wrong.length === 0, `${route}: ${hrefs.length} button(s) reach the store`, wrong.join(', '));
  }

  await ctx.close();
}

/* ------------------------------------ 3. the dashboard's runtime CTA (JS on) */

console.log('\n— the dashboard upgrade button —');
{
  const ctx = await offline(await browser.newContext());
  // A session the dashboard accepts, with no Pro entitlement, so it renders the
  // upgrade gate. That gate's button is built by a template string and appears
  // in no HTML file, so this is the only place it can be looked at.
  await ctx.addInitScript(() => {
    localStorage.setItem(
      'jotlift.session',
      JSON.stringify({
        access_token: 'test-token',
        refresh_token: 'r',
        expires_at: Date.now() + 3600_000,
      }),
    );
  });
  // The dashboard talks to Supabase before it renders. Nothing here is testing
  // the API, so the calls it makes are answered from the harness: a user, and
  // an entitlement mirror that says this reader has no subscription, which is
  // exactly the state that draws the upgrade gate. These are registered after
  // the abort above, and the last matching route wins, so they are what those
  // requests meet rather than the refusal.
  await ctx.route('**/auth/v1/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', email: 'a@b.c' }) }),
  );
  await ctx.route('**/functions/v1/entitlement', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'none' }) }),
  );
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/dashboard/`);

  // The gate has to actually appear. Without this wait the page is still in its
  // loading phase, no button exists, and "none of them are wrong" would pass on
  // a dashboard that never rendered a way to subscribe at all.
  let drew = true;
  try {
    await page.waitForSelector('[data-app-link]', { timeout: 10_000 });
  } catch {
    drew = false;
  }
  check(drew, 'the upgrade gate drew its button');

  const hrefs = await page.$$eval('[data-app-link]', (nodes) => nodes.map((n) => n.getAttribute('href')));
  const wrong = hrefs.filter((h) => h !== APP_STORE_URL);
  check(wrong.length === 0, `every rendered button reaches the store (${hrefs.length} found)`, wrong.join(', '));
  await ctx.close();
}

/* --------------------------------------------------------------------- end */

await browser.close();
server.close();

console.log(failures === 0 ? '\nall good\n' : `\n${failures} failed\n`);
process.exit(failures === 0 ? 0 : 1);

/* The public pages' behaviour: the hero walk, the exercise card's tick, and the
 * pricing switch. Driven in Chromium against the site served on 127.0.0.1:8099,
 * like relay.test.mjs:
 *
 *   npx http-server -p 8099 -s -c-1 . &
 *   node tools/pages.test.mjs
 */

import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8099';
const browser = await chromium.launch();
let failures = 0;
const check = (ok, label, extra = '') => {
  if (!ok) { failures++; console.log(`  ✗ ${label} ${extra}`); }
  else console.log(`  ✓ ${label}`);
};

async function open(path, options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + path);
  return { ctx, page, errors };
}

const shown = (page) => page.$$eval('[data-shot]', (els) => els.filter((e) => !e.hidden && e.style.opacity !== '0').map((e) => e.dataset.shot));

console.log('\n— the hero walk —');
{
  const { ctx, page, errors } = await open('/', { colorScheme: 'light' });
  check((await page.locator('[data-dot]').count()) === 7, 'seven screens, one dot each');
  check((await page.textContent('[data-hero-caption]')).trim() === 'Logging a set', 'it opens on the logger');

  await page.click('[data-dot="3"]');
  await page.waitForTimeout(450);
  check(JSON.stringify(await shown(page)) === '["history-log"]', 'a dot steps to its screen, and only that one stays', JSON.stringify(await shown(page)));
  check((await page.textContent('[data-hero-caption]')).trim() === 'Workout history', 'the caption names it');
  check((await page.getAttribute('[data-hero-caption]', 'aria-live')) === 'polite', 'a step the reader made is announced');

  await page.focus('[data-dot="3"]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(450);
  check((await page.textContent('[data-hero-caption]')).trim() === 'A finished workout', 'the arrow keys step it');
  check(await page.evaluate(() => document.activeElement.dataset.dot === '4'), 'and the focus follows');

  const before = await page.$$eval('[data-shot] img', (imgs) => imgs.map((i) => i.getAttribute('src')));
  await page.click('[data-theme-toggle]');
  const after = await page.$$eval('[data-shot] img', (imgs) => imgs.map((i) => i.getAttribute('src')));
  check(before.every((s) => s.endsWith('-light.webp')) && after.every((s) => s.endsWith('-dark.webp')),
    'the theme toggle swaps every capture to its dark twin');
  check((await page.textContent('[data-hero-caption]')).trim() === 'A finished workout', 'and the subject stays put');

  // Pause holds it still past the 4.6s step.
  await page.click('[data-hero-pause]');
  check((await page.getAttribute('[data-hero-pause]', 'aria-pressed')) === 'true', 'pause reads as pressed');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(5200);
  check((await page.textContent('[data-hero-caption]')).trim() === 'A finished workout', 'paused, it does not advance');
  check(errors.length === 0, 'no page errors', errors.join('|'));
  await ctx.close();
}

console.log('\n— on its own it advances, unannounced —');
{
  const { ctx, page } = await open('/');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(5200);
  check((await page.textContent('[data-hero-caption]')).trim() !== 'Logging a set', 'it walks on after one step time');
  check((await page.getAttribute('[data-hero-caption]', 'aria-live')) === 'off', 'and a step it took alone is not announced');
  await ctx.close();
}

console.log('\n— under Reduce Motion —');
{
  const { ctx, page } = await open('/', { reducedMotion: 'reduce' });
  check((await page.getAttribute('[data-hero-pause]', 'aria-pressed')) === 'true', 'it starts stopped');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(5200);
  check((await page.textContent('[data-hero-caption]')).trim() === 'Logging a set', 'and nothing advances on its own');
  await page.click('[data-dot="2"]');
  await page.waitForTimeout(250);
  const transforms = await page.$$eval('[data-shot]', (els) => els.map((e) => e.style.transform).filter((t) => t && t !== 'none'));
  check(transforms.length === 0, 'a step is a cross-fade: nothing slides', transforms.join(','));
  check(JSON.stringify(await shown(page)) === '["routines"]', 'and lands on its screen', JSON.stringify(await shown(page)));
  await ctx.close();
}

console.log('\n— the exercise card —');
{
  const { ctx, page } = await open('/');
  const tick = page.locator('[data-tick][aria-pressed="false"]');
  await tick.click();
  check((await page.locator('.setrow--logged').count()) === 3, 'the tick logs the greyed set');
  check(await page.$eval('.setrow:last-of-type .tick', (t) => t.classList.contains('is-popping')), 'and pops');
  await ctx.close();
}

console.log('\n— pricing —');
{
  const { ctx, page } = await open('/pricing/');
  await page.waitForSelector('.seg__thumb');
  await page.click('[data-plan="weekly"]');
  await page.waitForTimeout(400);
  check((await page.textContent('[data-price-amount]')).trim() === 'US$1.99', 'weekly reads its own price');
  check(await page.$eval('[data-price-amount] .roll', (r) => r.classList.contains('roll--down')), 'and rolls down to a smaller number');
  const fit = await page.evaluate(() => {
    const on = document.querySelector('[data-plan="weekly"]');
    const thumb = document.querySelector('.seg__thumb');
    return { thumb: thumb.getBoundingClientRect().left, on: on.getBoundingClientRect().left, w: thumb.offsetWidth, ow: on.offsetWidth };
  });
  check(Math.abs(fit.thumb - fit.on) < 1 && fit.w === fit.ow, 'the thumb sits under the chosen plan', JSON.stringify(fit));
  await page.click('[data-plan="yearly"]');
  await page.waitForTimeout(50);
  check(await page.$eval('[data-price-amount] .roll', (r) => !r.classList.contains('roll--down')), 'and up to a larger one');
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
process.exit(failures ? 1 : 0);

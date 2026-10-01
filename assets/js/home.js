/* Home. The hero phone walk, the exercise card's tick, and the two live price
 * lines. */

import { applyAppLink } from './app-link.js';
import { initTheme, currentTheme } from './theme.js';
import { priceRow, savedCountry, heroPriceLine, proPriceLine } from './prices.js';

initTheme();
applyAppLink();

/* ---------------------------------------------------------------- the price */

const row = priceRow(savedCountry());
const heroPrice = document.querySelector('[data-hero-price]');
if (heroPrice) heroPrice.textContent = heroPriceLine(row);
const proPrice = document.querySelector('[data-pro-price]');
if (proPrice) proPrice.textContent = proPriceLine(row);

/* ---------------------------------------------------------------- the phone */

/*
 * Seven real captures, walked in order, one subject at a time. Each is a panel
 * stacked in the screen; a step slides the old one out and the new one in on
 * the app's push timing (320ms, decelerate-in), forward or back by direction.
 * Under Reduce Motion the step is a 160ms cross-fade and nothing moves.
 *
 * The dark capture shows in dark mode and the light one in light mode, and the
 * walk is THE SAME SEVEN SUBJECTS EITHER WAY: flipping the theme swaps the image
 * under the frame and leaves the subject and the timer where they were.
 */
const screen = document.querySelector('[data-hero-screen]');
const dots = document.querySelector('[data-hero-dots]');
const caption = document.querySelector('[data-hero-caption]');

if (screen && dots && caption) {
  const panels = [...screen.querySelectorAll('[data-shot]')];
  const imgs = panels.map((p) => p.querySelector('img'));
  const labels = imgs.map((img) => img.alt.replace(/, in the Jotlift app$/, ''));
  const n = panels.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const STEP_MS = 320;
  let at = 0;

  /* The page chooses the capture from here on, so the theme toggle wins over
     the device setting the <picture> sources were written against. */
  panels.forEach((p) => p.querySelectorAll('source').forEach((s) => s.remove()));
  function paint() {
    const mode = currentTheme();
    imgs.forEach((img, i) => {
      const src = `/assets/img/screens/${panels[i].dataset.shot}-${mode}.webp`;
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }

  dots.innerHTML = labels
    .map((label, i) => `<button type="button" data-dot="${i}" aria-label="${label}" aria-current="${i === 0}"></button>`)
    .join('');
  const buttons = [...dots.querySelectorAll('button')];

  function place(panel, x, animate) {
    panel.style.transition = animate
      ? reduce.matches
        ? 'opacity 160ms linear'
        : `transform ${STEP_MS}ms cubic-bezier(0.2, 0, 0, 1)`
      : 'none';
    if (reduce.matches) {
      panel.style.transform = 'none';
      panel.style.opacity = x === 0 ? '1' : '0';
    } else {
      panel.style.opacity = '1';
      panel.style.transform = `translateX(${x * 100}%)`;
    }
  }

  function show(index, dir = 1) {
    const next = ((index % n) + n) % n;
    if (next === at) return;
    const from = panels[at];
    const to = panels[next];
    to.hidden = false;
    from.style.zIndex = '0';
    to.style.zIndex = '1';
    place(to, dir, false);
    void to.offsetWidth;
    place(to, 0, true);
    place(from, -dir, true);
    const leaving = at;
    setTimeout(() => {
      if (leaving !== at) panels[leaving].hidden = true;
    }, STEP_MS + 40);
    at = next;
    caption.textContent = labels[at];
    buttons.forEach((b, i) => b.setAttribute('aria-current', String(i === at)));
  }

  buttons.forEach((b, i) =>
    b.addEventListener('click', () => {
      show(i, i > at ? 1 : -1);
      restart();
    }),
  );
  dots.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    show(at + dir, dir);
    buttons[at].focus();
    restart();
  });

  /* A horizontal swipe on the screen steps it, the way a phone would. */
  let startX = null;
  screen.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  screen.addEventListener('pointerup', (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    const dir = dx < 0 ? 1 : -1;
    show(at + dir, dir);
    restart();
  });

  /* Slow enough to read one screen. Paused while the reader is pointing at it
     or has focus in it, and while the tab is hidden. */
  const hero = document.querySelector('[data-hero]');
  let paused = false;
  hero.addEventListener('pointerenter', () => { paused = true; });
  hero.addEventListener('pointerleave', () => { paused = false; });
  hero.addEventListener('focusin', () => { paused = true; });
  hero.addEventListener('focusout', () => { paused = false; });

  let timer = null;
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused && !document.hidden) show(at + 1, 1);
    }, 4600);
  }

  document.addEventListener('jotlift:theme', paint);
  paint();
  panels.forEach((p, i) => {
    p.hidden = i !== 0;
    place(p, i === 0 ? 0 : 1, false);
  });
  /* The later captures load once the page has, so a step never lands on a
     blank screen. */
  window.addEventListener('load', () => imgs.forEach((img) => { img.loading = 'eager'; }));
  restart();
}

/* --------------------------------------------------------------- the tick */

/* The exercise card's tick logs the greyed set, as it does in the logger: the
   row tints, the numbers firm up, and the tick pops on the reward curve. */
document.querySelectorAll('[data-tick]').forEach((tick) =>
  tick.addEventListener('click', () => {
    const on = tick.getAttribute('aria-pressed') !== 'true';
    const rowEl = tick.closest('.setrow');
    tick.setAttribute('aria-pressed', String(on));
    rowEl.classList.toggle('setrow--logged', on);
    rowEl.classList.toggle('setrow--ghost', !on);
    tick.classList.remove('is-popping');
    if (on) {
      void tick.offsetWidth;
      tick.classList.add('is-popping');
    }
  }),
);

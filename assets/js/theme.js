/* The appearance toggle.
 *
 * One semantic token set, two modes. With no choice made, the page follows the
 * device, as the app does: the stylesheet reads `prefers-color-scheme` while
 * <html> carries no `data-theme`. A press records an explicit choice, which
 * the inline script in each page's <head> applies before first paint.
 *
 * This module wires the header button and tells the rest of the page when the
 * mode changed (the hero swaps its capture on that event), including when the
 * device itself changes appearance under a reader who never chose.
 */

const KEY = 'jotlift.theme';
const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export function currentTheme() {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return media && media.matches ? 'dark' : 'light';
}

function announce() {
  document.dispatchEvent(new CustomEvent('jotlift:theme', { detail: { theme: currentTheme() } }));
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // A reader with storage blocked still gets the toggle, just not the memory.
  }
  announce();
}

export function initTheme() {
  media?.addEventListener?.('change', () => {
    if (!document.documentElement.hasAttribute('data-theme')) announce();
  });
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  button.addEventListener('click', () => {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });
}

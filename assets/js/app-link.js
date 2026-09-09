/* Where "Get the app" and "Subscribe in the app" point.
 *
 * THE ONE PLACE TO CHANGE IF THE STORE LISTING EVER MOVES. Jotlift is live on
 * the App Store, so every one of those buttons goes straight to the listing.
 *
 * The static pages carry this URL as a plain href, because every public page
 * has to work with JavaScript turned off. This module is what keeps the
 * buttons the dashboard renders at runtime pointing at the same place, and it
 * re-asserts the href on the static ones so a page and this file can never
 * drift apart unnoticed. `tools/app-link.test.mjs` checks both.
 */

export const APP_STORE_URL = 'https://apps.apple.com/us/app/jotlift-workout-log/id6780453950';

/** Point every app-store button at the listing. */
export function applyAppLink() {
  if (!APP_STORE_URL) return;
  for (const link of document.querySelectorAll('[data-app-link]')) {
    link.setAttribute('href', APP_STORE_URL);
    link.setAttribute('rel', 'noopener');
  }
}

/* The segmented control's sliding thumb (src/ui/Segmented.tsx).
 *
 * Without script the chosen segment carries the elevated fill itself, so the
 * control reads correctly with JavaScript off. With it, one `.seg__thumb` rides
 * under the chosen segment and slides on the quick timing when the choice moves.
 *
 * The dashboard rebuilds its markup on every change, which would put a fresh
 * thumb straight under the new choice and never slide. So the last offset is
 * remembered per control, keyed by its aria-label, and a fresh thumb starts
 * there before moving.
 */

const last = new Map();

function chosen(seg) {
  return seg.querySelector('[aria-selected="true"], [aria-pressed="true"]');
}

export function placeThumbs(scope = document) {
  for (const seg of scope.querySelectorAll('.segmented')) {
    const on = chosen(seg);
    if (!on || on.offsetWidth === 0) continue;
    let thumb = seg.querySelector('.seg__thumb');
    const key = seg.getAttribute('aria-label') || '';
    const to = { x: on.offsetLeft, w: on.offsetWidth };
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'seg__thumb';
      thumb.setAttribute('aria-hidden', 'true');
      seg.prepend(thumb);
      seg.classList.add('has-thumb');
      const from = last.get(key);
      if (from && (from.x !== to.x || from.w !== to.w)) {
        thumb.style.transition = 'none';
        thumb.style.transform = `translateX(${from.x}px)`;
        thumb.style.width = `${from.w}px`;
        void thumb.offsetWidth;
        thumb.style.transition = '';
      }
    }
    thumb.style.transform = `translateX(${to.x}px)`;
    thumb.style.width = `${to.w}px`;
    last.set(key, to);
  }
}

let wired = false;
/** Keep thumbs under their segments when the layout reflows. */
export function watchThumbs() {
  if (wired) return;
  wired = true;
  window.addEventListener('resize', () => placeThumbs());
  document.fonts?.ready.then(() => placeThumbs());
}

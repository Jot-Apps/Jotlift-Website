/* Pricing. The plan switch, the storefront picker, and the derived lines. */

import { applyAppLink } from './app-link.js';
import { initTheme } from './theme.js';
import {
  ROWS,
  priceRow,
  savedCountry,
  saveCountry,
  fmt,
  planPrice,
  perWeek,
  PLAN_PER,
  TRIAL_DAYS,
  TRIAL_PLAN,
  usdFromText,
} from './prices.js';

initTheme();
applyAppLink();

const state = { plan: 'yearly', country: savedCountry(), query: '', open: false };

const el = {
  planButtons: [...document.querySelectorAll('[data-plan]')],
  country: document.querySelector('[data-country]'),
  toggle: document.querySelector('[data-country-toggle]'),
  menu: document.querySelector('[data-country-menu]'),
  list: document.querySelector('[data-country-list]'),
  query: document.querySelector('[data-country-query]'),
  name: document.querySelector('[data-country-name]'),
  code: document.querySelector('[data-country-code]'),
  echo: document.querySelector('[data-country-echo]'),
  free: document.querySelector('[data-price-free]'),
  amount: document.querySelector('[data-price-amount]'),
  per: document.querySelector('[data-price-per]'),
  note: document.querySelector('[data-price-note]'),
  trial: document.querySelector('[data-price-trial]'),
  terms: document.querySelector('[data-price-terms]'),
};

document.querySelector('[data-usd-from]').textContent = usdFromText;

function renderPrices() {
  const row = priceRow(state.country);
  const plan = state.plan;
  const price = planPrice(row, plan);
  const trial = plan === TRIAL_PLAN;

  el.name.textContent = row[0];
  el.code.textContent = row[1];
  el.echo.textContent = row[0];
  el.free.textContent = fmt(row, 0);
  el.amount.textContent = fmt(row, price);
  el.per.textContent = PLAN_PER[plan];
  // The same comparison the paywall draws: every plan per week, except weekly,
  // where the per-week figure IS the price.
  el.note.textContent =
    plan === 'weekly' ? 'Billed every week.' : `About ${fmt(row, perWeek(row, plan))} a week.`;
  // The trial pill and its terms belong to the yearly plan only.
  el.trial.firstElementChild.textContent = `${TRIAL_DAYS} days free`;
  el.trial.classList.toggle('is-off', !trial);
  el.trial.setAttribute('aria-hidden', String(!trial));
  // Keeps the yearly wording when hidden, so the line holds the same height.
  el.terms.textContent = `Free for ${TRIAL_DAYS} days, then ${fmt(row, planPrice(row, TRIAL_PLAN))} a year. New subscribers only.`;
  el.terms.classList.toggle('is-off', !trial);
  el.terms.setAttribute('aria-hidden', String(!trial));

  el.planButtons.forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.plan === plan)),
  );
}

function renderList() {
  const q = state.query.trim().toLowerCase();
  const matches = q ? ROWS.filter((r) => r[0].toLowerCase().includes(q)) : ROWS;
  if (matches.length === 0) {
    el.list.innerHTML = '<p class="country__empty">No match. Try another country.</p>';
    return;
  }
  el.list.innerHTML = matches
    .map(
      (r) =>
        `<button type="button" role="option" data-pick="${r[0].replace(/"/g, '&quot;')}"` +
        ` aria-selected="${r[0] === state.country}"><span>${r[0]}</span><span>${r[1]}</span></button>`,
    )
    .join('');
}

function setOpen(open) {
  state.open = open;
  el.menu.hidden = !open;
  el.toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    state.query = '';
    el.query.value = '';
    renderList();
    el.query.focus();
  }
}

el.planButtons.forEach((b) =>
  b.addEventListener('click', () => {
    state.plan = b.dataset.plan;
    renderPrices();
  }),
);

el.toggle.addEventListener('click', () => setOpen(!state.open));

el.query.addEventListener('input', () => {
  state.query = el.query.value;
  renderList();
});

el.list.addEventListener('click', (e) => {
  const button = e.target.closest('[data-pick]');
  if (!button) return;
  state.country = button.dataset.pick;
  saveCountry(state.country);
  setOpen(false);
  renderPrices();
});

document.addEventListener('click', (e) => {
  if (state.open && !el.country.contains(e.target)) setOpen(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.open) {
    setOpen(false);
    el.toggle.focus();
  }
});

renderPrices();

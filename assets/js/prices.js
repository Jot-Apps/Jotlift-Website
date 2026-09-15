/* App Store prices, compiled from data/store-prices.json: the three Pro plans
 * read from App Store Connect through RevenueCat (weekly live, monthly and
 * yearly as scheduled from 2026-09-16). tools/domain.test.mjs checks every row
 * against that file, so the table and its source cannot quietly disagree.
 *
 * ONLY THE STOREFRONTS THAT PRICE IN THEIR OWN CURRENCY. Apple bills the rest
 * in US dollars, because it runs no local-currency storefront there, and a
 * picker that answers "Kenya" with a USD figure is not telling a Kenyan what
 * their currency costs. Those are covered by one line under the picker instead.
 * The United States keeps its row: USD is its own currency. 66 + 1 = 67 rows.
 *
 * IN THE SHIPPED CLIENTS THESE NUMBERS ARE NEVER HARDCODED. P04: "Price
 * display: localized from the store." This table exists only so the web page
 * can show a figure before a store SDK has answered. Keep that boundary: it is
 * what the page prints, never what anybody is charged.
 *
 * Row shape: [country, currency, weekly, monthly, yearly, decimalPlaces]
 */

export const SYM = {
  AED: 'AED', AUD: 'A$', BRL: 'R$', CAD: 'C$', CHF: 'CHF', CLP: 'CLP$', CNY: 'CN¥',
  COP: 'COP$', CZK: 'Kč', DKK: 'kr', EGP: 'E£', EUR: '€', GBP: '£', HKD: 'HK$',
  HUF: 'Ft', IDR: 'Rp', ILS: '₪', INR: '₹', JPY: '¥', KRW: '₩', KZT: '₸',
  MXN: 'MX$', MYR: 'RM', NGN: '₦', NOK: 'kr', NZD: 'NZ$', PEN: 'S/', PHP: '₱',
  PKR: '₨', PLN: 'zł', QAR: 'QR', RON: 'lei', RUB: '₽', SAR: 'SR', SEK: 'kr',
  SGD: 'S$', THB: '฿', TRY: '₺', TWD: 'NT$', TZS: 'TSh', USD: 'US$', VND: '₫', ZAR: 'R',
};

/* Decimals belong to the CURRENCY, not to how the export printed the number:
 * zero for JPY, KRW, VND, IDR, HUF, CLP, COP, TWD, TZS, PKR, NGN, KZT and RUB,
 * two for everything else. So Switzerland reads "CHF 35.00", not "CHF35". */
export const ROWS = [
  ['Australia', 'AUD', 2.99, 4.99, 29.99, 2],
  ['Austria', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Belgium', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Bosnia and Herzegovina', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Brazil', 'BRL', 12.9, 19.9, 129.9, 2],
  ['Bulgaria', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Canada', 'CAD', 2.99, 3.99, 24.99, 2],
  ['Chile', 'CLP', 1990, 2990, 22990, 0],
  ['China mainland', 'CNY', 15, 22, 148, 2],
  ['Colombia', 'COP', 9900, 14900, 99900, 0],
  ['Croatia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Cyprus', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Czech Republic', 'CZK', 49, 79, 499, 2],
  ['Denmark', 'DKK', 19, 29, 179, 2],
  ['Egypt', 'EGP', 99.99, 149.99, 999.99, 2],
  ['Estonia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Finland', 'EUR', 1.99, 2.99, 22.99, 2],
  ['France', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Germany', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Greece', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Hong Kong', 'HKD', 18, 22, 148, 2],
  ['Hungary', 'HUF', 999, 1490, 8990, 0],
  ['India', 'INR', 199, 299, 1999, 2],
  ['Indonesia', 'IDR', 29000, 59000, 399000, 0],
  ['Ireland', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Israel', 'ILS', 7.9, 9.9, 59.9, 2],
  ['Italy', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Japan', 'JPY', 300, 500, 3000, 0],
  ['Kazakhstan', 'KZT', 999, 1790, 11990, 0],
  ['Korea, Republic of', 'KRW', 3300, 4400, 33000, 0],
  ['Kosovo', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Latvia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Lithuania', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Luxembourg', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Malaysia', 'MYR', 9.9, 14.9, 99.9, 2],
  ['Malta', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Mexico', 'MXN', 39, 69, 399, 2],
  ['Montenegro', 'EUR', 1.99, 2.99, 19.99, 2],
  ['Netherlands', 'EUR', 1.99, 2.99, 22.99, 2],
  ['New Zealand', 'NZD', 3.99, 4.99, 39.99, 2],
  ['Nigeria', 'NGN', 3200, 4900, 29900, 0],
  ['Norway', 'NOK', 29, 39, 249, 2],
  ['Pakistan', 'PKR', 500, 900, 4900, 0],
  ['Peru', 'PEN', 9.9, 12.9, 89.9, 2],
  ['Philippines', 'PHP', 129, 199, 1290, 2],
  ['Poland', 'PLN', 9.99, 14.99, 99.99, 2],
  ['Portugal', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Qatar', 'QAR', 7.99, 9.99, 69.99, 2],
  ['Romania', 'RON', 9.99, 14.99, 99.99, 2],
  ['Russia', 'RUB', 199, 249, 1790, 0],
  ['Saudi Arabia', 'SAR', 9.99, 12.99, 89.99, 2],
  ['Serbia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Singapore', 'SGD', 2.98, 3.98, 29.98, 2],
  ['Slovakia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Slovenia', 'EUR', 1.99, 2.99, 22.99, 2],
  ['South Africa', 'ZAR', 39.99, 59.99, 399.99, 2],
  ['Spain', 'EUR', 1.99, 2.99, 22.99, 2],
  ['Sweden', 'SEK', 29, 39, 249, 2],
  ['Switzerland', 'CHF', 2, 3, 18, 2],
  ['Taiwan', 'TWD', 60, 90, 690, 0],
  ['Tanzania', 'TZS', 5900, 9900, 59900, 0],
  ['Thailand', 'THB', 79, 99, 699, 2],
  ['Türkiye', 'TRY', 99.99, 149.99, 999.99, 2],
  ['United Arab Emirates', 'AED', 7.99, 12.99, 79.99, 2],
  ['United Kingdom', 'GBP', 1.99, 2.99, 19.99, 2],
  ['United States', 'USD', 1.99, 2.99, 19.99, 2],
  ['Vietnam', 'VND', 59000, 99000, 599000, 0],
];

export const DEFAULT_COUNTRY = 'United States';

/** The row for a country, falling back to the default storefront. */
export function priceRow(country) {
  return (
    ROWS.find((r) => r[0] === country) || ROWS.find((r) => r[0] === DEFAULT_COUNTRY)
  );
}

/** The decimals a row's currency prints with. */
export function places(row) {
  return row[5];
}

/**
 * Typeset one amount in a row's currency.
 *
 * "CHF 35.00", not "CHF35": a symbol that ends in a letter runs into the
 * numeral without a non-breaking space. A glyph symbol (£, ¥, R$) sits tight,
 * as it should. Free is typeset the same way everywhere: a bare zero, never
 * "0.00".
 */
export function fmt(row, amount) {
  const sym = SYM[row[1]];
  const gap = /\p{L}$/u.test(sym) ? '\u00a0' : '';
  if (amount === 0) return sym + gap + '0';
  return (
    sym +
    gap +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: places(row),
      maximumFractionDigits: places(row),
    })
  );
}

/* ------------------------------------------------------------- the plans */

/** The three plans, in the order every page lists them. */
export const PLANS = ['weekly', 'monthly', 'yearly'];

const PLAN_INDEX = { weekly: 2, monthly: 3, yearly: 4 };

/** A plan's price in a row's currency. */
export function planPrice(row, plan) {
  return row[PLAN_INDEX[plan]];
}

/** What each plan's price is "per", as the page says it. */
export const PLAN_PER = { weekly: 'a week', monthly: 'a month', yearly: 'a year' };

/**
 * The free trial on the yearly plan, in days.
 *
 * THE ONE PLACE THE SITE STATES IT. The store configures the offer as
 * TWO_WEEKS on the annual product, and the app says "14 days free" (founder,
 * 2026-09-11). If the offer changes in App Store Connect, this changes with it:
 * the website has no store SDK to ask.
 */
export const TRIAL_DAYS = 14;

/** The plan that carries the trial. Only this one. */
export const TRIAL_PLAN = 'yearly';

/**
 * Weeks in a year and in a month, as the APP counts them
 * (src/features/billing/logic/per-week.ts): 52, and 52 / 12. The site and the
 * paywall must agree on what a plan works out to per week.
 */
export const WEEKS = { weekly: 1, monthly: 52 / 12, yearly: 52 };

/**
 * A plan's price per week, in the row's currency, ROUNDED UP.
 *
 * The same rule as the app's perWeekPriceString: divide in whole minor units,
 * then take the ceiling, so an exact division is never pushed up by float
 * noise and a real remainder never understates what the reader pays.
 */
export function perWeek(row, plan) {
  const scale = 10 ** places(row);
  const minor = Math.round(planPrice(row, plan) * scale);
  return Math.ceil(minor / WEEKS[plan]) / scale;
}

/** "US$1.99 a week, US$2.99 a month or US$19.99 a year" */
export function planListText(row) {
  const parts = PLANS.map((plan) => `${fmt(row, planPrice(row, plan))} ${PLAN_PER[plan]}`);
  return `${parts[0]}, ${parts[1]} or ${parts[2]}`;
}

/** The sentence every page uses for the trial. */
export const trialLine = `Yearly starts with ${TRIAL_DAYS} days free.`;

/**
 * The line under the storefront picker for the countries Apple bills in US
 * dollars. Those storefronts do not all share one price (Apple sets some of
 * them a step higher), so the line says "from" and quotes the lowest.
 */
const USD_ROW = ['', 'USD', 1.99, 2.99, 19.99, 2];
export const usdFromText = `from ${planListText(USD_ROW)}`;

/** The one price line the home page hero prints. */
export function heroPriceLine(row) {
  return `Free to log, forever. Pro is ${planListText(row)}.`;
}

/** The Pro column on the home page, and the dashboard's upgrade gate. */
export function proPriceLine(row) {
  return `${planListText(row)}. ${trialLine}`;
}

/* The reader's storefront is remembered so every page quotes the same one. */
const KEY = 'jotlift.country';

export function savedCountry() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && ROWS.some((r) => r[0] === saved)) return saved;
  } catch {
    /* storage blocked; fall through to the default storefront */
  }
  return DEFAULT_COUNTRY;
}

export function saveCountry(country) {
  try {
    localStorage.setItem(KEY, country);
  } catch {
    /* the picker still works, it just is not remembered */
  }
}

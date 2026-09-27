/* App Store prices, compiled from data/app-store-prices.csv (175 storefronts,
 * weekly, monthly and yearly), which is the live App Store Connect pricing of
 * jotlift_pro_weekly, jotlift_pro_monthly and jotlift_pro_annual read through
 * RevenueCat on 2026-09-27. tools/domain.test.mjs holds ROWS to that file.
 *
 * ONLY THE STOREFRONTS THAT PRICE IN THEIR OWN CURRENCY. Apple bills 108 of the
 * 175 in US dollars, because it runs no local-currency storefront there, and a
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

export const WEEK = 2;
export const MONTH = 3;
export const YEAR = 4;
const DECIMALS = 5;

/* How many of each period a year holds, for the savings line. */
const PER_YEAR = { [WEEK]: 52, [MONTH]: 12 };

/* The free trial on the annual plan (App Store Connect: introductory offer,
 * free, TWO_WEEKS). Once per person, so it is said as "for new subscribers".
 * "14 days", not "2 weeks", matching the app (founder, 2026-09-11). */
export const TRIAL_LINE = 'Annual starts with 14 days free for new subscribers.';

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
  const gap = /\p{L}$/u.test(sym) ? ' ' : '';
  if (amount === 0) return sym + gap + '0';
  return (
    sym +
    gap +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: row[DECIMALS],
      maximumFractionDigits: row[DECIMALS],
    })
  );
}

/** The USD line under the picker: the lowest US dollar price of each plan.
 *  Some USD storefronts sit a tier higher (US$3.99 a month, US$22.99 a year),
 *  which is why the page says "from". */
const USD_ROW = ['', 'USD', 1.99, 2.99, 19.99, 2];
export const usdWeekly = fmt(USD_ROW, USD_ROW[WEEK]);
export const usdMonthly = fmt(USD_ROW, USD_ROW[MONTH]);
export const usdYearly = fmt(USD_ROW, USD_ROW[YEAR]);

/** The yearly price expressed as a monthly one, on the currency's own grid. */
export function yearlyPerMonth(row) {
  const yearly = row[YEAR];
  return row[DECIMALS] === 0 ? Math.round(yearly / 12) : Math.round((yearly / 12) * 100) / 100;
}

/** How much less a year costs than a year of `period` (WEEK or MONTH), as a whole percent. */
export function savePercent(row, period = MONTH) {
  return Math.round((1 - row[YEAR] / (row[period] * PER_YEAR[period])) * 100);
}

/** "US$1.99 a week, US$2.99 a month or US$19.99 a year" */
export function planPrices(row) {
  return `${fmt(row, row[WEEK])} a week, ${fmt(row, row[MONTH])} a month or ${fmt(row, row[YEAR])} a year`;
}

/** The one price line the home page prints. */
export function heroPriceLine(row) {
  return `Free to log, forever. Pro is ${planPrices(row)}.`;
}

export function proPriceLine(row) {
  return `${planPrices(row)}. ${TRIAL_LINE}`;
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

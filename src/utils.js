import get from 'lodash/object/get';

const unavailable = '-';

export function format(msg, scope) {
  return msg.replace(/\{([^}]*)\}/g,(m, m1) => {
    const args = m1.replace(/\s+/g, '').split(',');

    const value = scope[args.shift()];

    if (args[0]) {
      args[1] = args[1] || args[0];
    }

    if (!args.length) {
      return value;
    }

    const formatter = get(formatters, args);

    if (!formatter) {
      console.error('no formatter for msg: ', msg);
      return value;
    }

    return formatter(value);
  });
}

const zeroIfNaN = x => isNaN(x) ? 0 : Number(x);
const isUnavailable = x => (x !== 0 && !x) || x === unavailable;

format.currency = (amount, precision = 2) => isUnavailable(amount) ? null : `$${zeroIfNaN(amount).toFixed(precision)}`;
  // format(`{amount, number, ${currency}}`, {amount: zeroIfNaN(amount)});
format.number = (num, precision = 0) => isUnavailable(num) ? null : zeroIfNaN(num).toFixed(precision);
format.percent = (perc, precision = 2) =>
  isUnavailable(perc)
    ? null
    : zeroIfNaN(perc * 100).toFixed(precision) + '%';

const formatters = {
  number: {
    number: format.number,
    USD: format.currency,
    currency: format.currency,
    percent: format.percent
  }
};

export const html = (...args) => ({__html: format(...args)});

export let __hotReload = true;

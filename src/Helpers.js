export const NumberHelper = {
  formatBRL: (value) =>
    Number.parseFloat(value).toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
  formatPercent: (value) => isNaN(value) ? "0.00%": Number.parseFloat(value).toFixed(2) + '%',
};

export const StringHelper = {
  abbreviate: (value, size) =>
    value.length > size ? value.substring(0, size) : value,
};

export const ArrayHelper = {
  sortAscending: (array, field) =>
    array.sort((i, j) => (i[field] > j[field] ? 1 : -1)),
  sortDescending: (array, field) =>
    array.sort((i, j) => (i[field] < j[field] ? 1 : -1)),
  derivedSum: (array, field) =>
    array.reduce((prev, next) => prev + next[field], 0),
  findItem: (array, field, value) => {
    let item = array.filter((item) => item[field] === value);
    return item.length ? item[0] : null;
  },
  resolveArrayOfObjectsFromProperties: (obj, keyPropName, valuePropName) => {
    if (!obj) {
      return [];
    }
    return Object.keys(obj).map((key) => {
      let item = {};
      item[keyPropName] = key;
      item[valuePropName] = obj[key];
      return item;
    });
  },
};

const months = {
  1: 'January',
  2: 'Febuary',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const DateHelper = {
  getMonthYear: (yyyy_mm) => {
    let [year, month] = yyyy_mm.split('-');
    return `${months[Number.parseInt(month)]} / ${year}`;
  },
};

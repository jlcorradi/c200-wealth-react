export const NumberHelper = {
  parseFloat: (value: string) => {
    try {
      return Number.parseFloat(value as string);
    } catch (e) {
      return 0;
    }
  },
  formatBRL: (value: number) =>
    (value ?? 0).toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatPercent: (value: number) => (value ?? 0).toFixed(2) + "%",
  formatStringAsBRL: (value: string) =>
    parseFloat(value).toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  formatStringAsPercent: (value: string) => parseFloat(value).toFixed(2) + "%",
};

export const StringHelper = {
  abbreviate: (value: string, size: number) =>
    value.length > size ? value.substring(0, size) : value,
};

export const ArrayHelper = {
  sortAscending: (array: Array<any>, field: string) =>
    array.sort((i, j) => (i[field] > j[field] ? 1 : -1)),
  sortDescending: (array: Array<any>, field: string) =>
    array.sort((i, j) => (i[field] < j[field] ? 1 : -1)),
  derivedSum: (array: Array<any>, field: string) =>
    array.reduce((prev, next) => prev + next[field], 0),
  findItem: (array: Array<any>, field: string, value: any) => {
    let item = array.filter((item) => item[field] === value);
    return item.length ? item[0] : null;
  },
  resolveArrayOfObjectsFromProperties: (
    obj: any,
    keyPropName: string,
    valuePropName: string
  ) => {
    if (!obj) {
      return [];
    }
    return Object.keys(obj).map((key) => {
      let item = {};
      // @ts-ignore
      item[keyPropName] = key;
      // @ts-ignore
      item[valuePropName] = obj[key];
      return item;
    });
  },
};

const months = {
  1: "January",
  2: "Febuary",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const DateHelper = {
  getMonthYear: (yyyy_mm: string) => {
    let [year, month] = yyyy_mm.split("-");
    // @ts-ignore
    return `${months[Number.parseInt(month)]} / ${year}`;
  },
};

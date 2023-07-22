import moment from 'moment';

/**
 * Convert date from ISO format to DD/MM/YYYY
 * @param dateISO
 * @return date format DD/MM/YYYY
 */
export const dateFormat = (dateISO: string) => {
  const date = moment(dateISO).format('DD/MM/YYYY').toString();

  return date;
};

/**
 * Convert date from DD/MM/YYYY to ISO format
 * @param date
 * @return date format ISO
 */
export const dateISOFormat = (date: string) => {
  const dateISO = moment(date, 'DD/MM/YYYY').toISOString();

  return dateISO;
};

/**
 *
 * @param string
 * @returns the new string joined by a dot
 */
export const splitString = (string: string): string => {
  string = string.toString();
  const stringList: string[] = [];
  while (string.length > 3) {
    stringList.unshift(string.slice(-3));
    string = string.slice(0, -3);
  }
  stringList.unshift(string);
  return stringList.join('.');
};

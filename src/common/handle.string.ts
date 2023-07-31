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
  let remainingLength = string.length;
  while (remainingLength > 3) {
    const part = string.slice(remainingLength - 3, remainingLength);
    stringList.unshift(part);
    remainingLength -= 3;
  }
  if (remainingLength > 0) {
    stringList.unshift(string.slice(0, remainingLength));
  }
  return stringList.join('.');
};

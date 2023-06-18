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

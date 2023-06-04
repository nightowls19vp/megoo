import moment from 'moment';

export const dateFormat = (dob: string) => {
  const date = moment(dob).format('DD/MM/YYYY').toString();

  return date;
};

export const dateISOFormat = (dob: string) => {
  const dateISO = moment(dob, 'DD/MM/YYYY').toISOString();

  return dateISO;
};

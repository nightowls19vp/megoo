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
  let startIndex = 0;

  // Handle the case when the string length is not divisible by 3
  if (remainingLength % 3 !== 0) {
    stringList.push(string.slice(0, remainingLength % 3));
    startIndex = remainingLength % 3;
  }

  while (startIndex < remainingLength) {
    const part = string.slice(startIndex, startIndex + 3);
    stringList.push(part);
    startIndex += 3;
  }

  return stringList.join('.');
};

export const changeStatusPkgToVietnamese = (status: string) => {
  if (status === 'Active') {
    return 'Đang kích hoạt';
  } else if (status === 'Not Activated') {
    return 'Chưa kích hoạt';
  } else if (status === 'Expired') {
    return 'Hết hạn';
  }
};

export const changeStatusBillToVietnamese = (status: string) => {
  if (status === 'PENDING') {
    return 'Chờ thanh toán';
  } else if (status === 'APPROVED') {
    return 'Đã xác nhận';
  } else if (status === 'CANCELED') {
    return 'Từ chối';
  }
};

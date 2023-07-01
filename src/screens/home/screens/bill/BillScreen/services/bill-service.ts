import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

/**
 * Get members in group
 * @param groupId
 * @return member list in group
 */
export const getMembers = async (groupId: string) => {
  const membersEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=members`;
  const reqUrl = `${URL_HOST}${membersEndpoint}`;
  console.log('Get members:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get members error: ', error);
  }
};

// Create bill api
export const createBill = async (
  groupId: string,
  bill: any,
  //  {
  //   summary: string;
  //   date: Date;
  //   borrowers: [];
  //   lender: string;
  //   description: string;
  // },
) => {
  const billEndpoint = `api/pkg-mgmt/bill/${groupId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Create bill:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        summary: bill.summary,
        date: bill.date,
        borrowers: bill.borrowers,
        lender: bill.lender,
        description: bill.description,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Get members error: ', error);
  }
};

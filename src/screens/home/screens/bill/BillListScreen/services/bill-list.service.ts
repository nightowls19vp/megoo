import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

/**
 * Get bill list
 * @param groupId
 * @return response from server
 */
export const getBillList = async (groupId: string) => {
  const billListEndpoint = `/pkg-mgmt/bill/${groupId}`;
  const reqUrl = `${URL_HOST}${billListEndpoint}`;
  console.log('Get bill list:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get bill list error: ', error);
  }
};

/**
 * Create bill
 * @param groupId
 * @return response from server
 */
export const createBill = async (groupId: string) => {
  const billEndpoint = `/pkg-mgmt/bill/${groupId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Create bill:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Get bill list error: ', error);
  }
};

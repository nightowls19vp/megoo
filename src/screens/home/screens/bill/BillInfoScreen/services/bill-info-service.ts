import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getBillInfo = async (billId: string) => {
  const billEndpoint = `api/pkg-mgmt/bill/${billId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Get bill info:', reqUrl);

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
    console.log('Get bill info error: ', error);
  }
};

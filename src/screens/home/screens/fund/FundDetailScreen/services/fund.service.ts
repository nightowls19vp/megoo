import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getFundById = async (fundId: string) => {
  const fundEndpoint = `api/pkg-mgmt/funding/${fundId}`;
  const reqUrl = `${URL_HOST}${fundEndpoint}`;
  console.log(`Get fund ${fundId} :`, reqUrl);

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
    console.log('Get fun by id error: ', error);
  }
};

export const deleteFundById = async (fundId: string) => {
  const fundEndpoint = `api/pkg-mgmt/funding/${fundId}`;
  const reqUrl = `${URL_HOST}${fundEndpoint}`;
  console.log(`Delete fund ${fundId} :`, reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete fund error: ', error);
  }
};

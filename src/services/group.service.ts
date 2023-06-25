import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../core/config/api/api.config';

export const getUserGroup = async () => {
  const groupEndpoint = `api/pkg-mgmt/gr/user_id?role=All`;
  const reqUrl = `${URL_HOST}${groupEndpoint}`;
  console.log('Get user groups:', reqUrl);

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
    console.log("Get user's group error:", error);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../core/config/api/api.config';

export const activate = async (groupId: string, pkg: Object) => {
  const activateEndpoint = `api/pkg-mgmt/gr/${groupId}/activate`;
  const reqUrl = `${URL_HOST}${activateEndpoint}`;
  console.log('Activate group:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        package: pkg,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log('Data:', response.data);

    return response.data;
  } catch (error) {
    console.log('Activate:', error);

    if (axios.isAxiosError(error)) {
      console.log('Activate error:', error.response?.data);
    }
  }
};

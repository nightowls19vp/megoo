import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTodosById = async (todosId: string) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${todosId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Get todos by id:', reqUrl);

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
    console.log('Get todos error: ', error);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTaskById = async (taskId: string) => {
  const taskEndpoint = `api/pkg-mgmt/task/${taskId}`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Get task by id:', reqUrl);

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
    console.log('Get task by id error: ', error);
  }
};

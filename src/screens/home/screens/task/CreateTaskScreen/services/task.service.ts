import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const createTask = async (groupId: string, task: any) => {
  const taskEndpoint = `api/pkg-mgmt/task/${groupId}`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Get task list:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.post(reqUrl, task, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Create task error: ', error);
  }
};

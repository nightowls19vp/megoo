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

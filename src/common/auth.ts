import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { URL_HOST } from '../core/config/api/api.config';
import { IJWTToken } from './interfaces/token.interface';
import { IUser } from './interfaces/user.interface';
import { signOutIfSignedInWithGG, validate } from '../screens/login/screens/LoginScreen/services/login.service';
import userStore from './store/user.store';
import { ISettings } from './interfaces/settings.interface';
import { dateFormat } from './handle.string';

export const checkValidToken = async (token: string) => {
  // console.log("AT:", accessToken);

  const payload = jwtDecode(token) as IJWTToken;
  const isTokenExpired = Date.now() >= payload.exp * 1000;

  return isTokenExpired;
};

export const checkLogin = async () => {
  console.log("Check login");

  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  let isLoggedIn = false;

  // Check if refresh token expired or not
  if (refreshToken !== null) {
    console.log("before check RT");

    const isRefreshTokenExpired = await checkValidToken(`${refreshToken}`);
    console.log('access token:', accessToken);
    console.log('refresh token:', refreshToken);
    console.log("check refresh token:", isRefreshTokenExpired);


    /**
     * If refresh token has not expired then get user info
     * then check if access token expired or not
     * ---- If access token expired -> Use refresh token to call API refresh
     * ---- Else, call validate API to get user info
     * Else if refresh token expired then ask user to login again
     */

    if (isRefreshTokenExpired === false) {
      console.log("Refresh token has not expired");
      const isAccessTokenExpired = await checkValidToken(`${accessToken}`);

      console.log("Check access token expired:", isAccessTokenExpired);

      if (isAccessTokenExpired === true) {
        console.log("Access token expired");

        try {
          const refreshEndpoint = 'api/auth/refresh';
          const reqUrl = `${URL_HOST}${refreshEndpoint}`;
          const response = await axios.get(reqUrl, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          console.log("Res refresh token:", response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("Refresh api error:", error.response?.data);
          }
        }

      } else {
        console.log("Access token has not expired");
        const response = await validate(`${accessToken}`);
        // console.log('Validate res:', response.data.userInfo);

        // Store user info
        let user: IUser = {
          _id: '',
          name: '',
          dob: '',
          email: '',
          phone: '',
          avatar: '',
        };

        console.log("ID:", response.userInfo._id);

        user._id = response.userInfo._id ?? '';
        user.name = response.userInfo.name ?? '';
        user.email = response.userInfo.email ?? '';
        user.phone = response.userInfo.phone ?? '';
        user.dob = dateFormat(response.userInfo.dob) ?? '';
        user.avatar =
          response.userInfo.avatar ??
          'https://res.cloudinary.com/nightowls19vp/image/upload/v1683454262/cld-sample.jpg';

        userStore.setUser(user);

        console.log("avatar:", userStore.avatar);

        // Store user settings
        let settings: ISettings = {
          callNoti: true,
          msgNoti: true,
          stockNoti: true,
          newsNoti: true,
        };

        settings.callNoti =
          response.userInfo.setting.callNoti;
        settings.msgNoti =
          response.userInfo.setting.msgNoti;
        settings.stockNoti =
          response.userInfo.setting.stockNoti;
        settings.newsNoti =
          response.userInfo.setting.newsNoti;

        userStore.setUserSettings(settings);
      }

      isLoggedIn = true;
    } else {
      console.log("Refresh token expired");
      await signOutIfSignedInWithGG();
      isLoggedIn = false;
    }
  } else {
    await signOutIfSignedInWithGG();
    isLoggedIn = false;
  }

  return isLoggedIn;
};

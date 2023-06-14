import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {io, Socket} from 'socket.io-client';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../core/config/api/api.config';
import {
  signOutIfSignedInWithGG,
  validate,
} from '../screens/login/screens/LoginScreen/services/login.service';
import {dateFormat} from './handle.string';
import {ISettings} from './interfaces/settings.interface';
import {IJWTToken} from './interfaces/token.interface';
import {IUser} from './interfaces/user.interface';
import userStore from './store/user.store';
import {SendBirdChatService} from '../services/sendbird-chat.service';

export const checkValidToken = async (token: string) => {
  // console.log("AT:", accessToken);

  const payload = jwtDecode(token) as IJWTToken;
  const isTokenExpired = Date.now() >= payload.exp * 1000;
  console.log('Date.now():', Date.now());
  console.log('Payload.exp:', payload.exp * 1000);

  return isTokenExpired;
};

export let socket: Socket;

export const connectSocket = (userId: string) => {
  // Connect socket
  const token = userId;
  console.log('socket token:', token);

  const URL = 'https://e4a7-14-186-146-44.ngrok-free.app';
  socket = io(URL, {
    autoConnect: false,
    query: {token},
  });

  socket.connect();

  console.log(socket.connect());
  console.log('connect');

  // Event listeners
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('zpCallback', data => {
    console.log('Socket on data:', data);
  });
};

export const checkLogin = async () => {
  // await signOutIfSignedInWithGG();
  console.log('Check login');

  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  let isLoggedIn = false;

  // Check if refresh token expired or not
  if (refreshToken !== null) {
    const isRefreshTokenExpired = await checkValidToken(`${refreshToken}`);
    console.log('access token:', accessToken);
    console.log('refresh token:', refreshToken);

    /**
     * If refresh token has not expired then get user info
     * then check if access token expired or not
     * ---- If access token expired -> Use refresh token to call API refresh
     * ---- Else, call validate API to get user info
     * Else if refresh token expired then ask user to login again
     */

    if (isRefreshTokenExpired === false) {
      console.log('Refresh token has not expired');
      const isAccessTokenExpired = await checkValidToken(`${accessToken}`);

      if (accessToken !== null) {
        if (isAccessTokenExpired === true) {
          console.log('Access token expired');

          try {
            const refreshEndpoint = 'api/auth/refresh';
            const reqUrl = `${URL_HOST}${refreshEndpoint}`;
            const response = await axios.get(reqUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${refreshToken}`,
              },
            });
            console.log('Res refresh token:', response.data);
            await AsyncStorage.setItem(
              'accessToken',
              response.data.accessToken,
            );
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('Refresh api error:', error.response?.data);
            }
          }
        }

        console.log('Access token has not expired');
        const response = await validate();
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

        user._id = response.userInfo._id ?? '';
        user.name = response.userInfo.name ?? '';
        user.email = response.userInfo.email ?? '';
        user.phone = response.userInfo.phone ?? '';
        user.dob = dateFormat(response.userInfo.dob) ?? '';
        user.avatar =
          response.userInfo.avatar ??
          'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9';

        userStore.setUser(user);

        // Store user settings
        let settings: ISettings = {
          callNoti: true,
          msgNoti: true,
          stockNoti: true,
          newsNoti: true,
        };

        settings.callNoti = response.userInfo.setting.callNoti;
        settings.msgNoti = response.userInfo.setting.msgNoti;
        settings.stockNoti = response.userInfo.setting.stockNoti;
        settings.newsNoti = response.userInfo.setting.newsNoti;

        userStore.setUserSettings(settings);

        const userSendBird = await SendBirdChatService.getInstance().connect(
          user._id,
        );
        console.log('userSendBird from auth:', userSendBird);

        const token = user._id;
        console.log('socket token:', token);

        // const URL = 'ws://localhost:3001';
        // socket = io(URL, {
        //   autoConnect: false,
        //   query: {token},
        // });

        const URL = 'https://9385-14-186-161-174.ngrok-free.app';
        const socket1 = io(URL, {
          autoConnect: false,
          query: {token},
        });

        socket1.connect();

        socket1.on('connect', () => {
          console.log('Connected to server');
          console.log('socket id:', socket1.id);
        });

        socket1.emit('receive-message', token);
        console.log('emit successfully');

        socket1.on('send-message', data => {
          console.log('socket id:', socket1.id);
          console.log('send-message data:', data);
        });

        socket1.on('zpCallback', async data => {
          console.log('zpCallback data:', data);
          console.log('zpCallback app trans id:', data.app_trans_id);
          // Request permissions (required for iOS)
          // await notifee.requestPermission();

          // Create a channel (required for Android)
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });

          // Display a notification
          await notifee.displayNotification({
            title: 'Thanh toán',
            body: `Đơn hàng ${data.app_trans_id} của bạn đã thanh toán thành công. Nhóm của bạn đã được tạo.`,
            android: {
              channelId,
              // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
              },
            },
          });
        });
      }

      isLoggedIn = true;
    } else {
      console.log('Refresh token expired');
      // await signOutIfSignedInWithGG();
      isLoggedIn = false;
    }
  } else {
    // await signOutIfSignedInWithGG();
    isLoggedIn = false;
  }

  return isLoggedIn;
};

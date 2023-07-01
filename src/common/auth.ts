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
import {GroupChannel} from '@sendbird/chat/groupChannel';

export const checkValidToken = async (token: string) => {
  // console.log("AT:", accessToken);

  const payload = jwtDecode(token) as IJWTToken;
  const isTokenExpired = Date.now() >= payload.exp * 1000;
  console.log('Date.now():', Date.now());
  console.log('Payload.exp:', payload.exp * 1000);

  return isTokenExpired;
};

export let socket: Socket;

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
        console.log(
          'Validate res:',
          JSON.stringify(response.userInfo, null, 2),
        );

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
          response.data?.userInfo.avatar ??
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

        console.log('User id:', user._id);

        const userSendBird = await SendBirdChatService.getInstance().connect(
          user._id,
        );
        console.log('userSendBird from auth:', userSendBird);

        // Get user's SendBird's channels
        const channelsUrl =
          await SendBirdChatService.getInstance().getChannels();
        console.log('channelsUrl:', channelsUrl);

        // channelsUrl.channels.forEach((channelUrl: string) => {
        //   SendBirdChatService.getInstance()
        //     .sendbird.groupChannel.getChannel(channelUrl)
        //     .then((groupChannel: GroupChannel) => {
        //       console.log('groupChannel:', groupChannel);

        //       // Invite user to channel then accept invitation then join channel
        //       // if user is not a member of channel
        //       const members = groupChannel.members;
        //       console.log('members:', members);

        //       const isUserInMembersArray = members.some(
        //         member => member.userId === userStore.id,
        //       );
        //       console.log('isUserInMembersArray:', isUserInMembersArray);

        //       if (isUserInMembersArray === false) {
        //         console.log("User isn't a member of channel");
        //         SendBirdChatService.getInstance()
        //           .inviteUserToChannel(channelUrl, [user._id])
        //           .then(res => {
        //             console.log('Invite user to channel res:', res);
        //           });
        //       }
        //     });
        // });

        // Connect socket
        const token = user._id;
        console.log('socket token:', token);

        // Connect socket on port 3001, change to ngrok link if can't connect by localhost
        const URL = 'https://localhost:3001';
        const socket1 = io(URL, {
          autoConnect: false,
          query: {token},
        });

        socket1.disconnect();

        socket1.connect();

        // Listen for socket events
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
          console.log('type zpCallback data:', data);
          //{"app_id":2553,"app_trans_id":"230622_164636725","app_time":1687427196852,"app_user":"64940af1536c05ee69e5361a","amount":150000,"embed_data":"{\"redirecturl\":\"https://www.youtube.com/watch?v=q8AzTS4Yq3I\u0026ab_channel=Quy%C3%AAnLouis\"}","item":"[{\"id\":\"6494016fc50761022fe09041\",\"name\":\"Experience Package\",\"price\":150000,\"quantity\":1,\"duration\":1,\"noOfMember\":6}]","zp_trans_id":230622000003245,"server_time":1687427252734,"channel":36,"merchant_user_id":"","zp_user_id":"","user_fee_amount":0,"discount_amount":0}
          //convert line above to object
          const dataObj = JSON.parse(data);
          console.log('dataObj app trans id:', dataObj.app_trans_id);

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
            body: `Đơn hàng ${dataObj.app_trans_id} của bạn đã thanh toán thành công. Nhóm của bạn đã được tạo.`,
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

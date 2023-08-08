import {io, Socket} from 'socket.io-client';
import notifee from '@notifee/react-native';
import {URL_HOST, URL_SOCKET} from '../config/api/api.config';
import {displayNotification} from '../push-notifee/notifee';
import userStore from '../../common/store/user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export let socket: Socket;

export function connectSocket(userId: string) {
  const token = userId;
  console.log('socket token:', token);

  // Connect socket on port 3001, change to ngrok link if can't connect by localhost;
  socket = io(URL_SOCKET, {
    autoConnect: false,
    query: {token},
  });

  socket.connect();

  // Waiting for socket to connect
  onConnect();
}

export function onConnect() {
  socket.on('connect', () => {
    console.log('Connected to server');
    console.log('socket id:', socket.id);

    // Listen for socket events
    listen();
  });
}

export async function listen() {
  // todo: listen for socket events
  onZpCallback();

  onCreatedBill();
  onUpdatedBill();

  onCreatedTodos();
  onUpdatedTodos();

  onTaskReminder();
}

export function onZpCallback() {
  socket.on('zpCallback', async (data: any) => {
    console.log('zpCallback data:', data);

    const dataObj = JSON.parse(data);
    console.log('dataObj app trans id:', dataObj.app_trans_id);

    // Request permissions (required for iOS)
    // await notifee.requestPermission();

    displayNotification(
      'Thanh toán thành công',
      `Giao dịch ${dataObj.app_trans_id} của bạn đã thanh toán thành công.`,
    );
  });
}

const getUserInfo = async (userId: string) => {
  const userEndpoint = `api/users/${userId}`;
  const reqUrl = `${URL_HOST}${userEndpoint}`;
  console.log('Get user info:', reqUrl);

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
    console.log('Get user info error: ', error);
  }
};

export function onCreatedBill() {
  socket.on('createdBill', async (data: any) => {
    console.log('createdBill data:', data);

    const response = await getUserInfo(data.lender);
    console.log('response:', response.user.name);

    const billNoti = await AsyncStorage.getItem('billNoti');

    if (billNoti === 'true') {
      if (userStore.id === data.lender) {
        displayNotification(
          'Phân chia chi tiêu mới',
          `Bạn nhận được yêu cầu thanh toán chi tiêu mới từ ${response.user.name}.`,
        );
      }
    }
  });
}

export function onUpdatedBill() {
  socket.on('updatedBill', async (data: any) => {
    console.log('updatedBill data:', data);
  });
}

export function onCreatedTodos() {
  socket.on('createdTodos', async (data: any) => {
    console.log('createdTodos data:', data);

    const response = await getUserInfo(data.createdBy);
    console.log('response:', response.user.name);

    const todosNoti = await AsyncStorage.getItem('todosNoti');
    console.log('todosNoti get from storage:', todosNoti);
    console.log('todosNoti type get from storage:', typeof todosNoti);

    if (todosNoti === 'true') {
      if (data.state === 'Public') {
        if (userStore.id === data.createdBy) {
          displayNotification(
            'Việc cần làm mới',
            `${response.user.name} đã thêm việc cần làm: ${data.summary}.`,
          );
        }
      }
    }
  });
}

export function onUpdatedTodos() {
  socket.on('updatedTodos', async (data: any) => {
    console.log('updatedTodos data:', data);

    const response = await getUserInfo(data.createdBy);
    console.log('response:', response.user.name);

    const todosNoti = await AsyncStorage.getItem('todosNoti');

    if (todosNoti === 'true') {
      if (data.state === 'Public') {
        displayNotification(
          'Cập nhật việc cần làm',
          `${response.user.name} đã cập nhật việc cần làm: ${data.summary}.`,
        );
      }
    }
  });
}
export function onTaskReminder() {
  socket.on('taskReminder', async (data: any) => {
    console.log('taskReminder data:', data);

    // const response = await getUserInfo(data.createdBy);
    // console.log('response:', response.user.name);

    const calendarNoti = await AsyncStorage.getItem('calendarNoti');

    if (calendarNoti === 'true') {
      displayNotification(
        'Nhắc nhở việc cần làm',
        `<b>${data.summary}</b>
        ${data.description}`,
      );
    }
  });
}

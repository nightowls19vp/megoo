import {io, Socket} from 'socket.io-client';
import notifee from '@notifee/react-native';
import {URL_SOCKET} from '../config/api/api.config';
import {displayNotification} from '../push-notifee/notifee';
import userStore from '../../common/store/user.store';

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

export function listen() {
  // todo: listen for socket events
  onZpCallback();
  onCreatedBill();
  onUpdatedBill();
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

export function onCreatedBill() {
  socket.on('createdBill', async (data: any) => {
    console.log('createdBill data stringify:', JSON.stringify(data, null, 2));
    console.log('createdBill data:', data);

    const result = await displayNotification(
      'Phân chia chi tiêu mới',
      `Bạn có một yêu cầu thanh toán chi tiêu mới từ ${data.lender}`,
    );
    console.log('result:', result);
  });
}

export function onUpdatedBill() {
  socket.on('updatedBill', async (data: any) => {
    console.log('updatedBill data:', data);
  });
}

const sendCreatedBillNotification = (
  receiverUserId: string,
  notificationContent: {title: string; body: string},
) => {
  socket.emit('notification', {
    receiverUserId,
    content: notificationContent,
  });
};

export function onReceivedBillNotification() {
  socket.on('notification', ({receiverUserId, content}) => {
    if (receiverUserId === userStore.id) {
      // Display the notification using Notifee
      displayNotification(content.title, content.body);
    }
  });
}

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RouteNames from '../../../../constants/route-names.const';
import styles from './styles/styles';
import userStore from './../../../../common/store/user.store';
import appStore from '../../../../common/store/app.store';
import {ILogoutRes} from './interfaces/logout.interface';
import {logout} from './services/settings.service';
import {signOutIfSignedInWithGG} from '../../../login/screens/LoginScreen/services/login.service';
import {observer} from 'mobx-react';
import {Colors} from '../../../../constants/color.const';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {socket} from '../../../../core/socket.io/socket.io';

const SettingsScreen = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [callNoti, setCallNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState(userStore.msgNoti);
  const [stockNoti, setStockNoti] = useState(userStore.stockNoti);
  const [billNoti, setBillNoti] = useState(true);
  const [todosNoti, setTodosNoti] = useState(true);
  const [calendarNoti, setCalendarNoti] = useState(true);

  const getNotiFromStorage = async (notiType: string) => {
    try {
      const noti = await AsyncStorage.getItem(`${notiType}`);
      if (noti) {
        console.log(`${notiType} get from storage:`, JSON.parse(noti));
        return JSON.parse(noti);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setBillNotiToStorage = async (value: boolean) => {
    try {
      const bill = await getNotiFromStorage('billNoti');

      if (bill !== value) {
        await AsyncStorage.setItem('billNoti', JSON.stringify(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initBillNoti = async () => {
    const bill = await getNotiFromStorage('billNoti');
    setBillNoti(bill);
  };

  const setTodosNotiToStorage = async (value: boolean) => {
    try {
      const todos = await getNotiFromStorage('todosNoti');

      if (todos !== value) {
        await AsyncStorage.setItem('todosNoti', JSON.stringify(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initTodosNoti = async () => {
    const todos = await getNotiFromStorage('todosNoti');
    setTodosNoti(todos);
  };

  const setCalendarNotiToStorage = async (value: boolean) => {
    try {
      const calendar = await getNotiFromStorage('calendarNoti');

      if (calendar !== value) {
        await AsyncStorage.setItem('calendarNoti', JSON.stringify(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initCalendarNoti = async () => {
    const calendar = await getNotiFromStorage('calendarNoti');
    setCalendarNoti(calendar);
  };

  useEffect(() => {
    setBillNotiToStorage(billNoti);
  }, [billNoti]);

  useEffect(() => {
    setTodosNotiToStorage(todosNoti);
  }, [todosNoti]);

  useEffect(() => {
    setCalendarNotiToStorage(calendarNoti);
  }, [calendarNoti]);

  useEffect(() => {
    initBillNoti();
    initTodosNoti();
    initCalendarNoti();
  }, []);

  return (
    <View style={styles.container}>
      {appStore.isLoggedIn ? (
        <View style={styles.settingsContainer}>
          <Text style={styles.title}>Thông báo</Text>
          <Text style={[styles.subtitle, {marginBottom: 5}]}>Ứng dụng</Text>

          <View style={styles.contentContainer}>
            <View style={styles.settingItem}>
              <Text style={styles.text}>Tin nhắn</Text>
              <FontAwesomeIcon
                onPress={() => {
                  console.log('msgNoti:', msgNoti);

                  setMsgNoti(!msgNoti);
                  userStore.setMsgNoti(msgNoti);
                  console.log('Msg noti:', userStore.msgNoti);
                }}
                name={userStore.msgNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.text}>Số lượng nhu yếu phẩm tồn kho</Text>
              <FontAwesomeIcon
                onPress={() => {
                  setStockNoti(!stockNoti);
                  userStore.setStockNoti(stockNoti);
                  console.log('Stock noti:', userStore.msgNoti);
                }}
                name={userStore.stockNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View>

            {/* <View style={styles.settingItem}>
              <Text style={styles.text}>Cuộc gọi</Text>
              <FontAwesomeIcon
                onPress={() => {
                  setCallNoti(!callNoti);
                  userStore.setCallNoti(callNoti);
                  console.log('Call noti:', userStore.callNoti);
                }}
                name={userStore.callNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View> */}
          </View>

          <Text style={[styles.subtitle, {marginTop: 10, marginBottom: 5}]}>
            Tiện ích
          </Text>
          <View style={styles.contentContainer}>
            <View style={styles.settingItem}>
              <Text style={styles.text}>Quản lý chi tiêu</Text>
              <FontAwesomeIcon
                onPress={async () => {
                  setBillNoti(!billNoti);

                  // await AsyncStorage.setItem('billNoti', `${billNoti}`);
                  // const noti = await AsyncStorage.getItem('billNoti');
                  // userStore.setBillNoti(billNoti);
                  // console.log('Bill noti after set & get:', noti);
                }}
                name={billNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.text}>Việc cần làm</Text>
              <FontAwesomeIcon
                onPress={async () => {
                  setTodosNoti(!todosNoti);
                  // await AsyncStorage.setItem('todosNoti', `${todosNoti}`);
                  // const noti = await AsyncStorage.getItem('todosNoti');
                  // userStore.setTodosNoti(todosNoti);
                  // console.log('Todos noti:', noti);
                }}
                name={todosNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.text}>Lịch biểu</Text>
              <FontAwesomeIcon
                onPress={() => {
                  setCalendarNoti(!calendarNoti);
                  userStore.setCalendarNoti(calendarNoti);
                  console.log('Calendar noti:', userStore.calendarNoti);
                }}
                name={userStore.calendarNoti ? 'toggle-on' : 'toggle-off'}
                style={styles.notiIcon}
              />
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Khác</Text>

        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteNames.APP_INFO as never, {} as never);
            }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Thông tin ứng dụng</Text>
            <FeatherIcon name={'chevron-right'} style={styles.settingIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(
                RouteNames.POLICIES_RIGHTS as never,
                {} as never,
              );
            }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Chính sách và quyền</Text>
            <FeatherIcon name={'chevron-right'} style={styles.settingIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {appStore.isLoggedIn ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>

          <Modal isVisible={modalVisible}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 10,
                gap: 20,
                padding: 20,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'justify',
                  color: Colors.text.grey,
                }}>
                Đăng xuất khỏi tài khoản của bạn?
              </Text>

              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: Colors.text.orange}}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setModalVisible(!modalVisible);

                    // If user logged in with Google account then logout google accoutn first
                    const refreshToken = await AsyncStorage.getItem(
                      'refreshToken',
                    );

                    const response = await logout(`${refreshToken}`);

                    // GoogleSignin.configure({
                    //   scopes: [
                    //     'https://www.googleapis.com/auth/userinfo.profile',
                    //     'https://www.googleapis.com/auth/user.phonenumbers.read',
                    //     'https://www.googleapis.com/auth/user.birthday.read',
                    //   ],
                    //   webClientId:
                    //     '768201973051-b9supnlu237m58th9c3du0qpp3m13cgl.apps.googleusercontent.com',
                    //   offlineAccess: true,
                    //   forceCodeForRefreshToken: true,
                    // });

                    await signOutIfSignedInWithGG();

                    socket.disconnect();

                    console.log('socket disconnected', socket.disconnected);

                    console.log('Logout msg:', response.message);

                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    const access = await AsyncStorage.getItem('accessToken');
                    console.log('AT after logout:', access);

                    userStore.resetStore();

                    appStore.setIsLoggedIn(false);

                    navigation.navigate(
                      RouteNames.HOME_DRAWER as never,
                      {} as never,
                    );
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Đăng xuất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate(RouteNames.LOGIN, {});
          }}>
          <Text style={styles.buttonText}>Đăng nhập/đăng ký</Text>
        </TouchableOpacity>
      )}

      <Toast position="top" />
    </View>
  );
};

export default observer(SettingsScreen);

import React, {useState} from 'react';
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

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import styles from './styles/styles';
import userStore from './../../../../common/store/user.store';
import appStore from '../../../../common/store/app.store';
import {ILogoutRes} from './interfaces/logout.interface';
import {logout} from './services/settings.service';
import {signOutIfSignedInWithGG} from '../../../login/screens/LoginScreen/services/login.service';
import {observer} from 'mobx-react';

const SettingsScreen = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newsNoti, setNewsNoti] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Thông báo</Text>

        <View style={styles.contentContainer}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Nhắc nhở mua nhu yếu phẩm</Text>
            <FontAwesomeIcon name={'toggle-on'} style={styles.notiIcon} />
          </View>

          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Nhắc nhở khuyến mãi</Text>
            <FontAwesomeIcon
              onPress={() => {
                setNewsNoti(!newsNoti);
                userStore.setNewsNoti(newsNoti);
              }}
              name={userStore.newsNoti ? 'toggle-on' : 'toggle-off'}
              style={styles.notiIcon}
            />
          </View>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Khác</Text>

        <View style={styles.contentContainer}>
          <TouchableOpacity
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
          <Text style={{fontSize: 24, textAlign: 'justify'}}>
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
              <Text style={{fontSize: 18}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setModalVisible(!modalVisible);

                // If user logged in with Google account then logout google accoutn first
                await signOutIfSignedInWithGG();
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                logout(`${refreshToken}`).then((response: ILogoutRes) => {
                  console.log('Logout msg:', response.message);

                  AsyncStorage.removeItem('accessToken');
                  AsyncStorage.removeItem('refreshToken');

                  appStore.setIsLoggedIn(false);

                  navigation.navigate(RouteNames.LOGIN as never, {} as never);
                });
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, color: 'red'}}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast position="top"></Toast>
    </View>
  );
};

export default observer(SettingsScreen);

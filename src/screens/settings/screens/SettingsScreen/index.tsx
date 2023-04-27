import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {logout} from './services/settings.service';
import styles from './styles/styles';
import userStore from './../../../../common/store/user.store';
import {ILogoutRes} from './interfaces/logout.interface';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';

export default function SettingsScreen({navigation}: {navigation: any}) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Thông báo</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.text}>Nhắc nhở mua nhu yếu phẩm</Text>
          <Text style={styles.text}>Nhắc nhở khuyến mãi</Text>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Khác</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.text}>Thông tin ứng dụng</Text>
          <Text style={styles.text}>Chính sách và quyền</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalVisible(!modalVisible);
          // logout(userStore.refreshToken).then((response: ILogoutRes) => {
          //   if (response.statusCode === 200) {
          //     Toast.show({
          //       type: 'success',
          //       text1: 'Đăng xuất thành công',
          //       autoHide: true,
          //       visibilityTime: 1000,
          //       topOffset: 20,
          //       bottomOffset: 20,
          //       onHide: () => {
          //         navigation.navigate(RouteNames.LOGIN as never, {} as never);
          //       },
          //     });
          //   }
          // });
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
              onPress={() => {
                setModalVisible(!modalVisible);
                logout(userStore.refreshToken).then((response: ILogoutRes) => {
                  console.log(response.message);
                  userStore.setAccessToken('');
                  userStore.setRefreshToken('');
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
}

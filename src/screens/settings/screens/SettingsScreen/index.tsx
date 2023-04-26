import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {logout} from './services/settings.service';
import styles from './styles/styles';
import userStore from './../../../../common/store/user.store';
import {ILogoutRes} from './interfaces/logout.interface';
import Toast from 'react-native-toast-message';

export default function SettingsScreen({navigation}: {navigation: any}) {
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
          logout(userStore.refreshToken).then((response: ILogoutRes) => {
            if (response.statusCode === 200) {
              Toast.show({
                type: 'success',
                text1: 'Đăng xuất thành công',
                autoHide: true,
                visibilityTime: 1000,
                topOffset: 20,
                bottomOffset: 20,
                onHide: () => {
                  navigation.navigate(RouteNames.LOGIN as never, {} as never);
                },
              });
            }
          });
        }}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <Toast position="top"></Toast>
    </View>
  );
}

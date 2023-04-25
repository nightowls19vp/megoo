import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import styles from './styles/styles';

const ProfileScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          // uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
          uri: userStore.avatar,
        }}
        style={styles.avatar}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thông tin cá nhân</Text>

        <TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate(
                RouteNames.EDIT_PROFILE as never,
                {} as never,
              );
            }}
            style={styles.editText}>
            Chỉnh sửa
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.text, {width: '40%'}]}>Email:</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.infoText, {width: '60%', textAlign: 'right'}]}>
            {userStore.email}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Họ tên:</Text>
          <Text style={styles.infoText}>{userStore.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Số điện thoại:</Text>
          <Text style={styles.infoText}>{userStore.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.text}>Ngày sinh:</Text>
          <Text style={styles.infoText}>{userStore.dob}</Text>
        </View>
      </View>

      <Text
        style={[
          styles.title,
          {
            width: '90%',
            textAlign: 'left',
            marginTop: 30,
            marginBottom: 10,
          },
        ]}>
        Tài khoản liên kết
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.socialContainer}>
            <Image
              source={require('../../../../../assets/google.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.text}>Tài khoản Google</Text>
          </View>
          <Text style={styles.connectText}>Liên kết</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.socialContainer}>
            <Image
              source={require('../../../../../assets/facebook.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.text}>Tài khoản Facebook</Text>
          </View>
          <Text style={styles.connectText}>Liên kết</Text>
        </View>
      </View>
    </View>
  );
};

export default observer(ProfileScreen);

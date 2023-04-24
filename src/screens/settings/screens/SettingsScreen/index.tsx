import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import styles from './styles/styles';

export default function SettingsScreen({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '90%',
        }}>
        <Text style={styles.title}>Thông báo</Text>

        <View
          style={{
            backgroundColor: Colors.background,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 10,
            borderRadius: 10,
            padding: 10,
          }}>
          <Text>Nhắc nhở mua nhu yếu phẩm</Text>
          <Text>Nhắc nhở khuyến mãi</Text>
        </View>
      </View>
    </View>
  );
}

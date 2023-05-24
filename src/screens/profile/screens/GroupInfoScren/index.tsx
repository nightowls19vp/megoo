import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {Colors} from '../../../../constants/color.const';
import styles from './styles/style';
import CurrentPackage from '../CurrentPackageScreen';

const GroupInfoScreen = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState('currentPackage');

  const renderTabContent = () => {
    if (activeTab === 'currentPackage') {
      return <CurrentPackage navigation={navigation} />;
    }
  };

  return (
    <View
      style={
        activeTab === 'currentPackage'
          ? [styles.container, {paddingBottom: 60}]
          : styles.container
      }>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'currentPackage'
                  ? Colors.primary
                  : Colors.background,
            },
          ]}
          onPress={() => {
            setActiveTab('currentPackage');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'currentPackage'
                    ? Colors.background
                    : Colors.primary,
              },
            ]}>
            Gói hiện tại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'group' ? Colors.primary : Colors.background,
            },
          ]}
          onPress={() => {
            setActiveTab('group');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'group' ? Colors.background : Colors.primary,
              },
            ]}>
            Các gói khác
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          position: 'relative',
          top: 60,
        }}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default GroupInfoScreen;

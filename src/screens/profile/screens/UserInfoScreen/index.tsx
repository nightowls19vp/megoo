import {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../../../../constants/color.const';
import GroupsScreen from '../GroupsScreen';
import ProfileScreen from '../ProfileScreen';
import styles from './styles/style';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const UserInfoScreen = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState('info');

  const renderTabContent = () => {
    if (activeTab === 'group') {
      return <GroupsScreen />;
    } else {
      return <ProfileScreen navigation={navigation} />;
    }
    // Add more cases for other tabs if needed
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'info' ? Colors.primary : Colors.background,
            },
          ]}
          onPress={() => {
            setActiveTab('info');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'info' ? Colors.background : Colors.primary,
              },
            ]}>
            Thông tin
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
            Nhóm
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

export default UserInfoScreen;

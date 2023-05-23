import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {Colors} from '../../../../constants/color.const';
import {getUserGroup} from '../GroupsScreen/services/group.service';
import {activate} from './services/group.info.service';
import styles from './styles/style';

// Define the type for the route params
type GroupDetailRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupDetailRouteProp = RouteProp<
  Record<string, GroupDetailRouteParams>,
  string
>;

const GroupInfoScreen = () => {
  const route = useRoute<GroupDetailRouteProp>();

  const [activeTab, setActiveTab] = useState('currentPackage');

  const [group, setGroup] = useState({
    _id: '',
    name: '',
    avatar: '',
    duration: 0,
    noOfMember: 0,
    status: '',
  });

  const getSelectedGroup = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    console.log('groupsRes:', groupsRes);
    console.log('route param:', route);

    const groups = groupsRes.groups.map((groupItem: any) => {
      return {
        _id: groupItem._id,
        name: groupItem.name,
        avatar: groupItem.avatar,
        duration: groupItem.packages[0].package.duration,
        noOfMember: groupItem.packages[0].package.noOfMember,
        status: groupItem.packages[0].status,
      };
    });

    const groupId = route.params?.groupId;

    const selectedGroup = groups.find((group: any) => group._id === groupId);

    console.log('selectedGroup', selectedGroup);

    setGroup(selectedGroup);
  };

  useEffect(() => {
    getSelectedGroup();
  }, []);

  const renderGroupItem = () => {
    return (
      <View
        style={{
          display: 'flex',
          gap: 10,
          borderRadius: 10,
          padding: 10,
          marginBottom: 20,
          backgroundColor: Colors.background,
        }}>
        <View>
          <Text style={{fontWeight: 'bold'}}>Tên gói: </Text>
          <Text>{group.name}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text style={{fontWeight: 'bold'}}>Thời hạn: </Text>
          <Text>{group.duration} tháng</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text style={{fontWeight: 'bold'}}>Số lượng thành viên: </Text>
          <Text>{group.noOfMember}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            maxHeight: 30,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            // backgroundColor: 'pink',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>Trạng thái: </Text>
            <Text>{group.status}</Text>
          </View>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 30,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.primary,
              borderRadius: 10,
            }}
            onPress={async () => {
              const response = await activate(group._id, {
                noOfMember: group.noOfMember,
                duration: group.duration,
                _id: group._id,
              });

              console.log('Activate response:', response);
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: Colors.background,
              }}>
              Kích hoạt
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text style={{fontWeight: 'bold'}}>Danh sách thành viên: </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        {renderGroupItem()}
      </ScrollView>
    </View>
  );
};

export default GroupInfoScreen;

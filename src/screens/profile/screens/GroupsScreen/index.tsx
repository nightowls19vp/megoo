import {useEffect, useState, useCallback} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import RouteNames from '../../../../constants/route-names.const';
import {Colors} from '../../../../constants/color.const';
import {getUserGroup} from './services/group.service';
import styles from './styles/style';
import {useFocusEffect} from '@react-navigation/native';

const GroupsScreen = ({navigation}: {navigation: any}) => {
  const [groups, setGroups] = useState([]);

  const getGroups = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    console.log('groupsRes:', groupsRes);

    setGroups(
      groupsRes.groups.map((groupItem: any) => {
        return {
          _id: groupItem._id,
          name: groupItem.name,
          avatar: groupItem.avatar,
          duration: groupItem.packages[0].package.duration,
          noOfMember: groupItem.packages[0].package.noOfMember,
          status: groupItem.packages[0].status,
        };
      }),
    );
  };

  useEffect(() => {
    getGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getGroups();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      return (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            console.log('Clicked');
            navigation.navigate(RouteNames.GROUP_INFO as never, {
              groupId: group._id,
            });
          }}>
          <Image
            source={{
              uri: group.avatar,
            }}
            style={styles.groupAvatar}
          />
          <View style={styles.groupInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Tên nhóm:{' '}
              </Text>
              <Text
                style={{
                  width: '50%',
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {group.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Thời hạn:{' '}
              </Text>
              <Text>{group.duration} tháng</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Số lượng thành viên:{' '}
              </Text>
              <Text>{group.noOfMember}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Trạng thái:{' '}
              </Text>
              <Text>{group.status}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return <View style={styles.container}>{renderGroupItem()}</View>;
};

export default GroupsScreen;

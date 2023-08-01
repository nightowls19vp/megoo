import {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import {changeStatusPkgToVietnamese} from '../../../../common/handle.string';

const GroupsScreen = ({navigation}: {navigation: any}) => {
  const [groups, setGroups] = useState([]);

  const getGroups = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    if (
      !groupsRes.groups ||
      !groupsRes?.groups?.length ||
      groupsRes?.groups?.length === 0
    ) {
      return [];
    } else {
      console.log('groupsRes:', groupsRes.groups[0].packages[0].package.name);
      console.log('groupsRes:', groupsRes);

      setGroups(
        groupsRes.groups.map((groupItem: any) => {
          return {
            _id: groupItem._id ? groupItem._id : '',
            name: groupItem.name ? groupItem.name : '',
            avatar: groupItem.avatar,
            // ? groupItem.avatar
            // : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
            duration: groupItem.packages[0].package.duration
              ? groupItem.packages[0].package.duration
              : 0,
            noOfMember: groupItem.packages[0].package.noOfMember
              ? groupItem.packages[0].package.noOfMember
              : 0,
            status: groupItem.packages[0].status
              ? groupItem.packages[0].status
              : '',
            members: groupItem.members ? groupItem.members : [],
          };
        }),
      );
    }
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
      const viStatus = changeStatusPkgToVietnamese(group.status);

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
              uri: group?.avatar || IMAGE_URI_DEFAULT,
            }}
            style={styles.groupAvatar}
          />
          <View style={styles.groupInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>Tên nhóm:</Text>
              <Text
                style={{
                  width: '50%',
                  color: Colors.text.lightgrey,
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {group.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>Thời hạn:</Text>
              <Text style={{color: Colors.text.lightgrey}}>
                {group.duration} tháng
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Số lượng thành viên:
              </Text>
              <Text style={{color: Colors.text.lightgrey}}>
                {group.noOfMember}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Trạng thái:
              </Text>
              <Text style={{color: Colors.text.lightgrey}}>{viStatus}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return <View style={styles.container}>{renderGroupItem()}</View>;
};

export default GroupsScreen;

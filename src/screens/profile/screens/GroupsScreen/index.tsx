import {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import {changeStatusPkgToVietnamese} from '../../../../common/handle.string';
import groupStore from '../../../../common/store/group.store';
import appStore from '../../../../common/store/app.store';

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
      // console.log('groupsRes:', groupsRes);

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
    if (appStore.isLoggedIn) {
      getGroups();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (appStore.isLoggedIn) {
        getGroups();
      }
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
            groupStore.setGroupId(group._id);
            navigation.navigate(RouteNames.GROUP_TABS as never, {
              // groupId: group._id,
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

  return appStore.isLoggedIn === true ? (
    <ScrollView contentContainerStyle={styles.container}>
      {renderGroupItem()}
    </ScrollView>
  ) : (
    <View style={styles.loginContainer}>
      <Image
        source={require('../../../../../assets/food.png')}
        style={{
          width: '100%',
          height: 100,
          // backgroundColor: Colors.border.lightgrey,
          resizeMode: 'center',
          marginBottom: 50,
        }}
      />
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Vui lòng </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.LOGIN, {});
          }}>
          <Text style={[styles.loginText, {color: Colors.text.orange}]}>
            đăng nhập/đăng ký
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.loginText}>để sử dụng chức năng này.</Text>
    </View>
  );
};

export default GroupsScreen;

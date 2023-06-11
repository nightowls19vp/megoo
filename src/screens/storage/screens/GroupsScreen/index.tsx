import {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import notifee from '@notifee/react-native';

import styles from './styles/style';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';

const UserGroupsScreen = ({navigation}: {navigation: any}) => {
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

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      return group.status === 'Active' ? (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            console.log('Clicked');
            navigation.navigate(RouteNames.STORAGE as never, {
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
                Số lượng thành viên:{' '}
              </Text>
              <Text>{group.noOfMember}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null;
    });
  };

  const onDisplayNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      {renderGroupItem()}
      <TouchableOpacity onPress={onDisplayNotification}>
        <Text>Display Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserGroupsScreen;

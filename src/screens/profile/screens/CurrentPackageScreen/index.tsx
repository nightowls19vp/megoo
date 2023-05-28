import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
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

const CurrentPackage = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupDetailRouteProp>();

  const [group, setGroup] = useState({
    _id: '',
    name: '',
    avatar: '',
    duration: 0,
    noOfMember: 0,
    status: '',
    members: [
      {
        role: '',
        user: '',
      },
    ],
  });

  const getSelectedGroup = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    console.log('groupsRes:', groupsRes.groups[0].name);
    console.log('groupsRes:', groupsRes);
    console.log('route param:', route);

    const groups = groupsRes?.groups.map((groupItem: any) => {
      return {
        _id: groupItem._id ? groupItem._id : '',
        name: groupItem.name ? groupItem.name : '',
        avatar: groupItem.avatar
          ? groupItem.avatar
          : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
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
    });

    const groupId = route.params?.groupId;
    console.log('route param id:', groupId);

    const selectedGroup = groups.find((group: any) => group._id === groupId);

    console.log('selectedGroup', selectedGroup);

    setGroup(selectedGroup);
  };

  useEffect(() => {
    getSelectedGroup();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri: group.avatar,
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Thông tin nhóm</Text>
        <View style={styles.groupInfoContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Tên nhóm: </Text>
            <Text
              style={{
                width: '80%',
                paddingRight: 20,
              }}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {group.name}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Thời hạn: </Text>
            <Text style={styles.infoText}>{group.duration} tháng</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Số lượng thành viên:{' '}
            </Text>
            <Text style={styles.infoText}>{group.noOfMember}</Text>
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
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Trạng thái:{' '}
              </Text>
              <Text style={styles.infoText}>{group.status}</Text>
            </View>
            {group.status === 'Not activated' ? (
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
                  console.log('groupId:', group._id);

                  const response = await activate(group._id, {
                    noOfMember: group.noOfMember,
                    duration: group.duration,
                    _id: group._id,
                  });

                  console.log('Activate response:', response);

                  if (response.statusCode === 200) {
                    Toast.show({
                      type: 'success',
                      text1: 'Kích hoạt thành công',
                      autoHide: true,
                      visibilityTime: 1000,
                      topOffset: 0,
                      onHide: () => {
                        navigation.navigate(RouteNames.PROFILE as never, {
                          activeTab: 'group',
                        });
                      },
                    });
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: response.message,
                      autoHide: false,
                    });
                  }
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.background,
                  }}>
                  Kích hoạt
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {/* <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Danh sách thành viên:{' '}
            </Text>
            {group.members.map((member, index) => {
              return (
                <View key={index}>
                  <Text style={styles.infoText}>{member.user}</Text>
                </View>
              );
            })}
          </View> */}
        </View>
        {group.status === 'Active' ? (
          <>
            <Text style={styles.title}>Liên kết tham gia</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                appStore.setIsExtendedPkg(true);
                appStore.setRenewGroupId(group._id);
                setTimeout(() => {
                  console.log('appStore.isExtendedPkg', appStore.isExtendedPkg);

                  navigation.navigate(RouteNames.PACKAGE, {});
                }, 1000);
              }}>
              <Text style={styles.buttonText}>Gia hạn gói</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      <Toast position="top"></Toast>
    </>
  );
};

export default CurrentPackage;

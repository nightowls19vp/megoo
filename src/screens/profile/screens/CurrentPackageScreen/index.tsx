import {Formik} from 'formik';
import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import * as Yup from 'yup';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {SendBirdChatService} from '../../../../services/sendbird-chat.service';
import {activate, invite} from './services/group.info.service';
import styles from './styles/style';
import {dateFormat} from '../../../../common/handle.string';
import {getGroupById} from '../../../../services/group.service';

const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupDetailRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupDetailRouteProp = RouteProp<
  Record<string, GroupDetailRouteParams>,
  string
>;

const InviteSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ'),
});

const CurrentPackage = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupDetailRouteProp>();

  const [packages, setPackages] = useState([]);

  const [group, setGroup] = useState({
    _id: '',
    name: '',
    channelUrl: '',
    avatar: '',
    duration: 0,
    noOfMember: 0,
    status: '',
    startDate: '',
    endDate: '',
    members: [
      {
        role: '',
        user: {
          _id: '',
          name: '',
          email: '',
          avatar: '',
        },
      },
    ],
  });

  const [emails, setEmails] = useState<string[]>([]);

  const groupId = route.params?.groupId;
  console.log('Group id from route:', groupId);

  const getSelectedGroup = async () => {
    // Get group info by id
    const groupRes = await getGroupById(groupId);
    console.log('groupsRes group:', groupRes.group);
    console.log('groupsRes group members:', groupRes?.group?.members);
    console.log('route param:', route);

    const activePackage = groupRes.group.packages.find(
      (pkg: any) => pkg.status === 'Active',
    );

    console.log('activePackage:', activePackage);

    if (!activePackage) {
      setGroup({
        _id: groupRes?.group._id ? groupRes?.group._id : '',
        name: groupRes?.group.name ? groupRes?.group.name : '',
        channelUrl: groupRes?.group.channel ? groupRes?.group.channel : '',
        avatar: groupRes?.group.avatar
          ? groupRes?.group.avatar
          : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
        duration: groupRes?.group.packages[0].package.duration
          ? groupRes?.group.packages[0].package.duration
          : 0,
        noOfMember: groupRes?.group.packages[0].package.noOfMember
          ? groupRes?.group.packages[0].package.noOfMember
          : 0,
        status: groupRes?.group.packages[0].status
          ? groupRes?.group.packages[0].status
          : '',
        startDate: activePackage?.startDate
          ? dateFormat(activePackage?.startDate)
          : '',
        endDate: activePackage?.endDate
          ? dateFormat(activePackage?.endDate)
          : '',
        members: groupRes?.group?.members ? groupRes?.group?.members : [],
      });
    } else {
      setGroup({
        _id: groupRes?.group._id ? groupRes?.group._id : '',
        name: groupRes?.group.name ? groupRes?.group.name : '',
        channelUrl: groupRes?.group.channel ? groupRes?.group.channel : '',
        avatar: groupRes?.group.avatar
          ? groupRes?.group.avatar
          : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
        duration: activePackage?.package?.duration
          ? activePackage?.package?.duration
          : 0,
        noOfMember: activePackage?.package?.noOfMember
          ? activePackage?.package?.noOfMember
          : 0,
        status: activePackage?.status ? activePackage?.status : '',

        startDate: activePackage?.startDate
          ? dateFormat(activePackage?.startDate)
          : '',
        endDate: activePackage?.endDate
          ? dateFormat(activePackage?.endDate)
          : '',
        members: groupRes?.group.members ? groupRes?.group.members : [],
      });
    }
  };

  // Extend package when package in group is expired
  const extendPackage = async () => {
    const extendPkgRes = await getGroupById(groupId);
    console.log('Extend pkg res:', extendPkgRes);

    // Set new package to user's group
    setGroup({
      _id: extendPkgRes?.group._id ? extendPkgRes?.group._id : '',
      name: extendPkgRes?.group.name ? extendPkgRes?.group.name : '',
      channelUrl: extendPkgRes?.group.channel
        ? extendPkgRes?.group.channel
        : '',
      avatar: extendPkgRes?.group.avatar
        ? extendPkgRes?.group.avatar
        : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
      duration: extendPkgRes?.group.packages[0].package.duration
        ? extendPkgRes?.group.packages[0].package.duration
        : 0,
      noOfMember: extendPkgRes?.group.packages[0].package.noOfMember
        ? extendPkgRes?.group.packages[0].package.noOfMember
        : 0,
      status: extendPkgRes?.group.packages[0].status
        ? extendPkgRes?.group.packages[0].status
        : '',
      startDate: extendPkgRes?.group.packages[0].startDate
        ? dateFormat(extendPkgRes?.group.packages[0].startDate)
        : '',
      endDate: extendPkgRes?.group.packages[0].endDate
        ? dateFormat(extendPkgRes?.group.packages[0].endDate)
        : '',
      members: extendPkgRes?.group.members ? extendPkgRes?.group.members : [],
    });
  };

  useEffect(() => {
    getSelectedGroup();
    if (group.status === 'Expired') {
      console.log('Package expired');
      extendPackage();
    } else {
      console.log("Package isn't expired");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getSelectedGroup();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri: group.avatar,
          }}
          style={styles.avatar}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            width: '90%',
            // backgroundColor: 'pink',
          }}>
          <Text style={styles.title}>Thông tin nhóm</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteNames.EDIT_GROUP_INFO, {
                groupId: group._id,
                avatarUrl: group.avatar,
              });
            }}>
            <Text style={styles.subTitle}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.groupInfoContainer}>
          <View style={[styles.infoRow, {flexWrap: 'wrap'}]}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Tên nhóm: </Text>
            <Text
              style={[
                styles.infoText,
                {
                  width: '100%',
                  paddingRight: 20,
                },
              ]}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {group.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Thời hạn: </Text>
            <Text style={styles.infoText}>{group.duration} tháng</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Số lượng thành viên:{' '}
            </Text>
            <Text style={styles.infoText}>{group.noOfMember}</Text>
          </View>
          {group.status === 'Active' ? (
            <>
              <View style={styles.infoRow}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Ngày kích hoạt:{' '}
                </Text>
                <Text style={styles.infoText}>{group.startDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Ngày hết hạn:{' '}
                </Text>
                <Text style={styles.infoText}>{group.endDate}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.activateGroupContainer}>
            <View style={styles.infoRow}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Trạng thái:{' '}
              </Text>
              <Text style={styles.infoText}>{group.status}</Text>
            </View>
            {group.status === 'Not Activated' ? (
              <TouchableOpacity
                style={styles.activateGroupButton}
                onPress={async () => {
                  console.log('groupId:', group._id);

                  const response = await activate(group._id, {
                    noOfMember: group.noOfMember,
                    duration: group.duration,
                    _id: group._id,
                  });

                  console.log('Activate response:', response);

                  if (response.statusCode === 200) {
                    const channelResponse =
                      await SendBirdChatService.getInstance().createGroupChannel(
                        group.name,
                        [`${group.members[0].user._id}`],
                      );

                    console.log(
                      'Create sendbird channel url:',
                      channelResponse?.url,
                    );

                    // Check if channel is created successfully
                    if (channelResponse?.url) {
                      const createChannelRes =
                        await SendBirdChatService.getInstance().createChannel(
                          group._id,
                          `${channelResponse?.url}`,
                        );
                      console.log('createChannelRes:', createChannelRes);
                    } else {
                      // todo: handle error
                    }

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
                <Text style={styles.activateGroupButtonText}>Kích hoạt</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View
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
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Image
                    source={{uri: member.user.avatar}}
                    style={styles.userAvatar}
                  />
                  <View style={styles.userNameContainer}>
                    <Text
                      style={
                        member.role !== 'Super User'
                          ? styles.infoText
                          : styles.superUserText
                      }>
                      {member.user.name}
                    </Text>
                    {member.role === 'Super User' ? (
                      <Foundation
                        name="crown"
                        size={20}
                        color={Colors.icon.lightgrey}
                      />
                    ) : (
                      false
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {group.status === 'Active' ? (
          <>
            <Text style={[styles.title, {width: '90%'}]}>Mời thành viên</Text>

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={InviteSchema}
              onSubmit={values => {
                setEmails(prevMembers => [...prevMembers, values.email]);
                // setFieldValue('email', '');
              }}>
              {({
                values,
                errors,
                touched,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
              }) => (
                <KeyboardAvoidingView
                  style={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    // gap: 10,
                    padding: 10,
                    marginBottom: 20,
                    backgroundColor: Colors.background.white,
                    borderRadius: 10,
                  }}
                  // behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                  // keyboardVerticalOffset={
                  //   Platform.OS === 'android' ? -200 : 200
                  // }
                >
                  <View style={styles.inviteContainer}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        onChangeText={value => {
                          setFieldValue('email', value);
                        }}
                        // onSubmitEditing={handleSubmit}
                        onBlur={() => setFieldTouched('email')}
                        style={styles.inputText}
                        placeholder={'Email'}
                        placeholderTextColor={Colors.text.lightgrey}
                        value={values.email}
                        keyboardType={'email-address'}
                      />

                      {values.email && (
                        <Ionicons
                          onPress={() => setFieldValue('email', '')}
                          name={'close'}
                          style={styles.inputIcon}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={styles.addButton}>
                      <Text style={styles.addButtonText}>Thêm</Text>
                    </TouchableOpacity>
                  </View>

                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View>
                    {emails.map((object, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            display: 'flex',
                          }}>
                          <View style={styles.emailsContainer} key={index}>
                            <View style={styles.email}>
                              <Text style={{fontSize: 20}}>•</Text>
                              <Text style={{fontSize: 16}}>{object}</Text>
                            </View>
                            <TouchableOpacity>
                              <Ionicons
                                onPress={() => {
                                  const emailIndex = emails.findIndex(
                                    (email: any) => email === object,
                                  );

                                  setEmails(prevMembers => {
                                    const updatedMembers = [...prevMembers];
                                    updatedMembers.splice(index, 1); // Remove the email at the specified index
                                    return updatedMembers;
                                  });
                                  console.log('members:', emails);
                                  console.log('emailIndex:', emailIndex);
                                }}
                                name={'remove-circle'}
                                style={styles.removeIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}

                    {emails.length > 0 ? (
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={async () => {
                          console.log('groupId:', group._id);
                          console.log('emails:', emails);

                          const response = await invite(group._id, emails);

                          console.log('Invite response:', response);

                          if (response.statusCode === 200) {
                            setFieldValue('email', '');
                            setEmails([]);

                            Toast.show({
                              type: 'success',
                              text1: 'Mời thành viên thành công',
                              autoHide: true,
                              visibilityTime: 1000,
                              topOffset: height * 0.17,
                              // onHide: () => {},
                            });
                          } else {
                            Toast.show({
                              type: 'error',
                              text1: 'Mời thành viên thất bại',
                              autoHide: true,
                              visibilityTime: 1000,
                              topOffset: height * 0.2,
                              // onHide: () => {},
                            });
                          }
                        }}>
                        <Text style={styles.inviteButtonText}>Mời tất cả</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </KeyboardAvoidingView>
              )}
            </Formik>

            {/* <Toast position="top" /> */}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                appStore.setIsExtendedPkg(true);
                appStore.setRenewGroupId(group._id);
                setTimeout(() => {
                  console.log('appStore.isExtendedPkg', appStore.isExtendedPkg);

                  navigation.navigate(RouteNames.PACKAGE_STACK_BOTTOM, {
                    params: {
                      screen: RouteNames.PACKAGE,
                      extendPkgId: group._id,
                    },
                  });
                }, 1000);
              }}>
              <Text style={styles.buttonText}>Gia hạn gói</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      <Toast position="top" />
    </>
  );
};

export default CurrentPackage;

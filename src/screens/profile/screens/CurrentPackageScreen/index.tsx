import {RouteProp, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useEffect, useState} from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';

import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../GroupsScreen/services/group.service';
import {activate, invite} from './services/group.info.service';
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

const InviteSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ'),
});

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

  const [emails, setEmails] = useState<string[]>([]);

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
            <Text style={styles.title}>Mời thành viên</Text>

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
                    backgroundColor: Colors.background,
                    borderRadius: 10,
                  }}
                  // behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                  // keyboardVerticalOffset={
                  //   Platform.OS === 'android' ? -200 : 200
                  // }
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: '70%',
                        height: 40,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        borderColor: Colors.secondary,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}>
                      <TextInput
                        onChangeText={value => {
                          setFieldValue('email', value);
                        }}
                        // onSubmitEditing={handleSubmit}
                        onBlur={() => setFieldTouched('email')}
                        style={{flex: 1, color: Colors.text}}
                        placeholder={'Email'}
                        placeholderTextColor={Colors.secondary}
                        value={values.email}
                        keyboardType={'email-address'}
                      />

                      {values.email && (
                        <Icon
                          onPress={() => setFieldValue('email', '')}
                          name={'close'}
                          style={{
                            fontWeight: '200',
                            color: Colors.secondary,
                            fontSize: 20,
                          }}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{
                        width: '25%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 10,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        borderRadius: 10,
                        backgroundColor: Colors.background,
                      }}>
                      <Text
                        style={{
                          color: Colors.primary,
                          fontWeight: 'bold',
                          fontSize: 14,
                        }}>
                        Thêm
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {touched.email && errors.email && (
                    <Text
                      style={{
                        marginTop: 10,
                        width: '90%',
                        color: Colors.error,
                        textAlign: 'left',
                      }}>
                      {errors.email}
                    </Text>
                  )}

                  <View>
                    {emails.map((object, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            display: 'flex',
                          }}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginVertical: 10,
                            }}
                            key={index}>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                              }}>
                              <Text style={{fontSize: 20}}>•</Text>
                              <Text style={{fontSize: 16}}>{object}</Text>
                            </View>
                            <TouchableOpacity>
                              <Icon
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
                                style={{
                                  fontWeight: '200',
                                  color: 'red',
                                  fontSize: 24,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}

                    {emails.length > 0 ? (
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: 20,
                          padding: 10,
                          borderWidth: 1,
                          borderColor: Colors.primary,
                          borderRadius: 10,
                          backgroundColor: Colors.background,
                        }}
                        onPress={async () => {
                          console.log('groupId:', group._id);
                          console.log('emails:', emails);

                          const response = await invite(group._id, emails);

                          console.log('Invite response:', response);

                          if (response.statusCode === 200) {
                            setFieldValue('email', '');
                            setEmails([]);
                          }
                        }}>
                        <Text
                          style={{
                            color: Colors.primary,
                            fontWeight: 'bold',
                          }}>
                          Mời tất cả
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </KeyboardAvoidingView>
              )}
            </Formik>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                appStore.setIsExtendedPkg(true);
                appStore.setRenewGroupId(group._id);
                setTimeout(() => {
                  console.log('appStore.isExtendedPkg', appStore.isExtendedPkg);

                  navigation.navigate(RouteNames.PACKAGE_STACK, {
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
      <Toast position="top"></Toast>
    </>
  );
};

export default CurrentPackage;

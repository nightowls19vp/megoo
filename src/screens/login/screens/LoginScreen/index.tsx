import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
// import Provider from '@ant-design/react-native/lib/provider';
// import Toast from '@ant-design/react-native/lib/toast';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {connectSocket} from '../../../../common/auth';
import {dateFormat} from '../../../../common/handle.string';
import {IAuthData} from '../../../../common/interfaces/data.interface';
import {ISettings} from '../../../../common/interfaces/settings.interface';
import {IUser} from '../../../../common/interfaces/user.interface';
import {IValidateRes} from '../../../../common/interfaces/validate.interface';
import appStore from '../../../../common/store/app.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {SendBirdChatService} from '../../../../services/sendbird-chat.service';
import {IGoogleLoginRes, ILoginRes} from './interfaces/login.interface';
import {
  googleSignIn,
  isUserSignedIn,
  login,
  validate,
} from './services/login.service';
import styles from './styles/styles';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
});

export default function LoginScreen({navigation}: {navigation: any}) {
  const [hidePassword, setHidePassword] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(true);

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e, 'I was closed.');
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.birthday.read',
      ],
      webClientId:
        '768201973051-b9supnlu237m58th9c3du0qpp3m13cgl.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    isUserSignedIn();
  }, []);

  // const [appIsReady, setAppIsReady] = useState(false);
  //
  // useEffect(() => {
  //   async function prepare() {
  //     console.log("AUTO RUNNNNNNN");

  //     try {
  //       await _cacheResourcesAsync();
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // Tell the application to render
  //       setAppIsReady(true);
  //     }
  //   }

  //   prepare();
  // }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }

  // const _cacheResourcesAsync = async () => {
  //   // need fix
  //   const images = ["assets/google.png", "assets/facebook.png"];

  //   const cacheImages = images.map((image) => {
  //     return Asset.fromModule(image).downloadAsync();
  //   });

  //   return Promise.all(cacheImages);
  // };

  return (
    // <Provider>
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={values => {
        login({
          username: values.email,
          password: values.password,
        }).then(async (response: ILoginRes) => {
          console.log('User info:', response?.data?.userInfo);
          console.log('Auth data:', response?.data?.auth);

          // Store user info
          let user: IUser = {
            _id: '',
            name: '',
            dob: '',
            email: '',
            phone: '',
            avatar: '',
          };

          user._id = response?.data?.userInfo['_id'] ?? '';
          user.name = response?.data?.userInfo['name'] ?? '';
          user.email = response?.data?.userInfo['email'] ?? '';
          user.phone = response?.data?.userInfo['phone'] ?? '';
          user.avatar = response?.data?.userInfo['avatar'] ?? '';

          let dob = response.data?.userInfo['dob'] ?? '';

          if (dob.length > 0) {
            user.dob = dateFormat(dob);
            // user.dob = moment(dob).format('DD/MM/YYYY').toString();
          } else {
            user.dob = '';
          }
          // user.dob = dateFormat(response.userInfo.dob) ?? '';
          console.log('user.dob:', user.dob);

          userStore.setUser(user);

          // connectSocket(user._id);

          // Connect user to SendBird server
          console.log('before connect to sendbird');
          const userSendBird = await SendBirdChatService.getInstance().connect(
            user._id,
          );
          console.log('userSendBird:', userSendBird);

          // Store user token
          await AsyncStorage.setItem('accessToken', `${response?.accessToken}`);
          await AsyncStorage.setItem(
            'refreshToken',
            `${response?.refreshToken}`,
          );

          // Show toast message and navigate to home screen if login successfully
          if (response.statusCode === 200) {
            Toast.show({
              type: 'success',
              text1: 'Đăng nhập thành công',
              autoHide: true,
              visibilityTime: 1000,
              topOffset: 30,
              bottomOffset: 40,
              onHide: () => {
                navigation.navigate(
                  RouteNames.HOME_DRAWER as never,
                  {} as never,
                );
                appStore.setIsLoggedIn(true);
              },
            });
          } else if (response.statusCode === 401) {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          } else if (response.statusCode === 404) {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
        });
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        setErrors,
        isValid,
        handleChange,
        handleSubmit,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Đăng nhập</Text>
          <View style={[styles.inputContainer]}>
            <TextInput
              onChangeText={value => setFieldValue('email', value)}
              onBlur={() => setFieldTouched('email')}
              style={{flex: 1, color: Colors.text}}
              placeholder={'Email'}
              placeholderTextColor={Colors.secondary}
              value={values.email}
            />

            {values.email && (
              <Icon
                onPress={() => setFieldValue('email', '')}
                name={'close'}
                style={styles.inputIcon}></Icon>
            )}
          </View>
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('password', value)}
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={hidePassword}
              placeholder={'Mật khẩu'}
              style={{flex: 1, color: Colors.text}}
              placeholderTextColor={Colors.secondary}
              value={values.password}
            />
            {values.password && (
              <Icon
                onPress={() => setFieldValue('password', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Icon
              onPress={() => setHidePassword(!hidePassword)}
              name={hidePassword ? 'eye' : 'eye-off'}
              style={styles.inputIcon}></Icon>
          </View>
          {touched.password && errors.password && (
            <Text style={[styles.error]}>{errors.password}</Text>
          )}

          <View
            style={{
              width: '80%',
            }}>
            <Text style={[styles.textPrimary, {textAlign: 'right'}]}>
              Quên mật khẩu?
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid ? Colors.primary : Colors.disabled,
              },
            ]}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <Toast position="top"></Toast>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              googleSignIn().then(async (response: IGoogleLoginRes) => {
                console.log('GG AT:', response.data?.accessToken);
                console.log('GG RT:', response.data?.refreshToken);

                // Store user token
                await AsyncStorage.setItem(
                  'accessToken',
                  `${response.data?.accessToken}`,
                );
                await AsyncStorage.setItem(
                  'refreshToken',
                  `${response.data?.refreshToken}`,
                );
                console.log(
                  'get AT:',
                  await AsyncStorage.getItem('accessToken'),
                );

                validate().then(async res => {
                  console.log('User data:', res);

                  // Store user data
                  let user: IUser = {
                    _id: '',
                    name: '',
                    dob: '',
                    email: '',
                    phone: '',
                    avatar: '',
                  };

                  // Store user info
                  user._id = res.userInfo._id ?? '';
                  user.name = res.userInfo.name ?? '';
                  user.email = res.userInfo.email ?? '';
                  user.phone = res.userInfo.phone ?? '';
                  user.dob = dateFormat(res.userInfo.dob) ?? '';
                  user.avatar =
                    res.userInfo.avatar ??
                    'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9';

                  userStore.setUser(user);

                  // Store user settings
                  let settings: ISettings = {
                    callNoti: true,
                    msgNoti: true,
                    stockNoti: true,
                    newsNoti: true,
                  };

                  settings.callNoti = res.userInfo.setting.callNoti ?? true;
                  settings.msgNoti = res.userInfo.setting.msgNoti ?? true;
                  settings.stockNoti = res.userInfo.setting.stockNoti ?? true;
                  settings.newsNoti = res.userInfo.setting.newsNoti ?? true;

                  userStore.setUserSettings(settings);
                  console.log('Call noti:', settings.callNoti);

                  // Connect user to SendBird server
                  const userSendBird =
                    await SendBirdChatService.getInstance().connect(user._id);
                  console.log('userSendBird from gg login:', userSendBird);
                });
                // Show toast message and navigate to home screen if login successfully
                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Đăng nhập thành công',
                    autoHide: true,
                    visibilityTime: 1000,
                    topOffset: 30,
                    bottomOffset: 40,
                    onHide: () => {
                      navigation.navigate(
                        RouteNames.HOME_DRAWER as never,
                        {} as never,
                      );
                      appStore.setIsLoggedIn(true);
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: response.message,
                    autoHide: false,
                    topOffset: 30,
                    bottomOffset: 40,
                  });
                }
              });
            }}>
            <Image
              source={require('../../../../../assets/google.png')}
              style={{...styles.socialButton.image}}
            />
            <Text style={styles.text}>Tiếp tục với Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../../../../assets/facebook.png')}
              style={{...styles.socialButton.image}}
            />
            <Text style={styles.text}>Tiếp tục với Facebook</Text>
          </TouchableOpacity>
          <View style={styles.flexRow}>
            <Text style={styles.textPrimary}>Chưa có tài khoản?</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Đăng ký');

                navigation.navigate(RouteNames.REGISTER as never, {} as never);
              }}>
              <Text style={[styles.textPrimary, styles.registerPrimary]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
    // </Provider>
  );
}
// AppRegistry.registerComponent('LoginScreen', () => LoginScreen);

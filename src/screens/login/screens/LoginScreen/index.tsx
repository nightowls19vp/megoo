import {ErrorMessage, Formik} from 'formik';
import React, {useEffect} from 'react';
import {
  AppRegistry,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
// import Provider from '@ant-design/react-native/lib/provider';
// import Toast from '@ant-design/react-native/lib/toast';
import Toast from 'react-native-toast-message';

import {Colors} from '../../../../constants/color.const';
import {ILoginRes} from './interfaces/login.interface';
import styles from './styles/styles';
import RouteNames from '../../../../constants/route-names.const';
import {googleSignIn, isSignedIn, login} from './services/login.service';
import userStore from '../../../../common/store/user.store';
import {IUser} from './../../../../interfaces/user.interface';
import {IAuthData} from '../../../../interfaces/data.interface';

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
    isSignedIn();
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
        }).then((response: ILoginRes) => {
          console.log('User info:', response?.data?.userInfo);
          console.log('Auth data:', response?.data?.auth);

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
          user.dob = moment(dob).format('DD/MM/YYYY').toString();

          userStore.setUser(user);

          // let auth: IAuthData = {
          //   id: '',
          //   username: '',
          //   role: '',
          //   password: '',
          //   hashedPassword: '',
          //   socialAccounts: [],
          // };

          // auth.id = response?.data?.auth['id'] ?? '';
          // auth.role = response?.data?.auth['role'] ?? '';
          // auth.username = response?.data?.auth['username'] ?? '';

          AsyncStorage.setItem('accessToken', `${response?.accessToken}`);
          AsyncStorage.setItem('refreshToken', `${response?.refreshToken}`);

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
              style={{flex: 1}}
              placeholder={'Email'}
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
              style={{flex: 1}}
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
              googleSignIn().then(user => {
                navigation.navigate(
                  RouteNames.HOME_DRAWER as never,
                  {} as never,
                );
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
AppRegistry.registerComponent('LoginScreen', () => LoginScreen);

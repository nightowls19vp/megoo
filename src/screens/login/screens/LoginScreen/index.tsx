import {Formik} from 'formik';
import React from 'react';
import {
  AppRegistry,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

// import Provider from '@ant-design/react-native/lib/provider';
// import Toast from '@ant-design/react-native/lib/toast';

import {Colors} from '../../../../constants/color.const';
import {ILoginRes} from './interfaces/login.interface';
// import {login} from './services/login.service';
import styles from './styles/styles';
import RouteNames from '../../../../constants/route-names.const';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
});

export default function LoginScreen({navigation}: {navigation: any}) {
  const [hidePassword, setHidePassword] = React.useState(true);
  const [showIcon, setShowIcon] = React.useState(false);

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e, 'I was closed.');
  };

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
        // same shape as initial values
        console.log(values);
        // login({username: values.email, password: values.password});
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
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
                style={[styles.inputIcon, {marginRight: 10}]}
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
            onPress={() => {
              // login({
              //   username: values.email,
              //   password: values.password,
              // }).then((response: ILoginRes) => {
              //   console.log(response.data);
              //   if (response.statusCode === 200) {
              //     Toast.success(response.message, 1);
              //     navigation.navigate(
              //       RoutesName.HOME_DRAWER as never,
              //       {} as never
              //     );
              //   } else {
              //     Toast.fail(response.message, 1);
              //   }
              // });
              navigation.navigate(RouteNames.HOME_DRAWER as never, {} as never);
            }}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid ? Colors.primary : Colors.disabled,
              },
            ]}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
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

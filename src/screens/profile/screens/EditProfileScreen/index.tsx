import React, {useState} from 'react';
import {
  AppRegistry,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {observer} from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import base64 from 'base64-js';

import styles from './styles/styles';
import RouteNames from '../../../../constants/route-names.const';
import {Colors} from '../../../../constants/color.const';
import userStore from '../../../../common/store/user.store';
import {editInfo} from './services/edit.info.service';
import {IEditInfoRes} from './interfaces/edit.info.interface';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string()
    .min(10, 'Số điện thoại không hợp lệ')
    .max(12, 'Số điện thoại không hợp lệ')
    .matches(/^(\+84)|0([3|5|7|8|9])(\d{8})$/, 'Số điện thoại không hợp lệ'),
  dob: Yup.string().required('Vui lòng nhập ngày sinh'),
});

const EditProfileScreen = ({navigation}: {navigation: any}) => {
  const dobISOString = moment(userStore.dob, 'DD/MM/YYYY').toISOString();
  const [date, setDate] = useState(new Date(dobISOString));
  const [selectedImages, setSelectedImages] = useState('');

  const [open, setOpen] = useState(false);

  const initialValues = {
    email: userStore.email,
    name: userStore.name,
    phone: userStore.phone,
    dob: userStore.dob,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProfileSchema}
      onSubmit={values => {
        const dobISOString = moment(values.dob, 'DD/MM/YYYY').toISOString();
        console.log(`Date: ${dobISOString}`);

        // same shape as initial values
        console.log(values);

        editInfo({
          name: values.name,
          phone: values.phone,
          dob: dobISOString,
        }).then((response: IEditInfoRes) => {
          console.log(response.statusCode);
          userStore.setName(values.name);
          userStore.setPhone(values.phone);
          userStore.setDob(values.dob);

          if (response.statusCode === 200) {
            Toast.show({
              type: 'success',
              text1: 'Sửa thông tin thành công',
              autoHide: true,
              visibilityTime: 1000,
              topOffset: 20,
              bottomOffset: 40,
              onHide: () => {
                navigation.navigate(RouteNames.PROFILE as never, {} as never);
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
        isValid,
        handleChange,
        handleSubmit,
      }) => (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              launchImageLibrary({mediaType: 'mixed'}, response => {
                console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                  console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                  let source: Asset[] = response.assets as Asset[];
                  console.log('source:', source[0].uri);
                  setSelectedImages(`${source[0].uri}`);
                }
              });
            }}>
            <Text>Choose image</Text>
          </TouchableOpacity>

          <Image
            source={{
              uri: selectedImages != '' ? selectedImages : userStore.avatar,
            }}
            style={{width: 150, height: 150, borderRadius: 150 / 2}}
          />

          {/* <Image
            source={{uri: `data:image/jpeg;base64,${base64String}`}}
            style={{
              width: 200,
              height: 200,
              borderWidth: 2,
              borderColor: 'black',
              borderRadius: 200 / 2,
            }}
          /> */}

          <View style={[styles.inputContainer]}>
            <TextInput
              onChangeText={value => setFieldValue('name', value)}
              onBlur={() => setFieldTouched('name')}
              style={{flex: 1}}
              placeholder={'Họ và tên'}
              value={values.name}
            />

            {values.name && (
              <Icon
                onPress={() => setFieldValue('name', '')}
                name={'close'}
                style={styles.inputIcon}></Icon>
            )}
          </View>
          {touched.name && errors.name && (
            <Text style={styles.error}>{errors.name}</Text>
          )}

          <View style={[styles.inputContainer]}>
            <TextInput
              onChangeText={value => setFieldValue('phone', value)}
              onBlur={() => setFieldTouched('phone')}
              style={{flex: 1}}
              placeholder={'Số điện thoại'}
              keyboardType="phone-pad"
              value={values.phone}
            />

            {values.phone && (
              <Icon
                onPress={() => setFieldValue('phone', '')}
                name={'close'}
                style={styles.inputIcon}></Icon>
            )}
          </View>
          {touched.phone && errors.phone && (
            <Text style={styles.error}>{errors.phone}</Text>
          )}

          <View style={[styles.inputContainer]}>
            <TextInput
              editable={false}
              onBlur={() => setFieldTouched('dob')}
              style={{flex: 1, color: 'black'}}
              placeholder={'Ngày sinh'}
              value={values.dob}
            />

            <DatePicker
              modal
              open={open}
              date={date}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={value => {
                console.log(value);

                setOpen(false);
                setDate(value);
                // setFieldValue('dob', value);
                setFieldValue('dob', moment(value).format('DD/MM/YYYY'));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            {values.dob && (
              <Icon
                onPress={() => setFieldValue('dob', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}></Icon>
            )}
            <Icon
              onPress={() => {
                setOpen(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}></Icon>
          </View>
          {touched.dob && errors.dob && (
            <Text style={styles.error}>{errors.dob}</Text>
          )}

          <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate(RouteNames.PROFILE as never, {} as never);
            // }}
            onPress={handleSubmit}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid ? Colors.primary : Colors.disabled,
              },
            ]}>
            <Text style={styles.buttonText}>Lưu thông tin</Text>
          </TouchableOpacity>

          <Toast position="top"></Toast>
        </View>
      )}
    </Formik>
  );
};

export default observer(EditProfileScreen);

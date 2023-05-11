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
import ImagePicker from 'react-native-image-crop-picker';

import styles from './styles/styles';
import RouteNames from '../../../../constants/route-names.const';
import {Colors} from '../../../../constants/color.const';
import userStore from '../../../../common/store/user.store';
import {
  changeAvatar,
  dataURLtoFile,
  editInfo,
  urltoFile,
} from './services/edit.info.service';
import {IEditInfoRes} from './interfaces/edit.info.interface';
import {dateFormat, dateISOFormat} from '../../../../common/handle.string';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {URL_HOST} from '../../../../core/config/api/api.config';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string()
    .optional()
    .min(10, 'Số điện thoại không hợp lệ')
    .max(12, 'Số điện thoại không hợp lệ')
    .matches(/^(\+84)|0([3|5|7|8|9])(\d{8})$/, 'Số điện thoại không hợp lệ'),
});

const EditProfileScreen = ({navigation}: {navigation: any}) => {
  const dobISOString = dateISOFormat(userStore.dob);
  const [date, setDate] = useState(new Date(dobISOString));
  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<any>();

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
        const dobISOString = dateISOFormat(values.dob);

        // If user change info then call API and update user store
        if (values.name !== userStore.name) {
          console.log('edit name');

          editInfo({
            name: values.name,
          }).then((response: IEditInfoRes) => {
            console.log(response.message);
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
              userStore.setName(response.data.name);
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
        }

        if (values.phone !== userStore.phone) {
          console.log('edit phone');

          editInfo({
            name: values.name,
            phone: values.phone,
          }).then((response: IEditInfoRes) => {
            console.log(response);
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
              userStore.setPhone(response.data.phone ?? '');
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
        }

        if (dobISOString !== userStore.dob) {
          console.log('edit dob');

          editInfo({
            name: values.name,
            dob: dobISOString,
          }).then((response: IEditInfoRes) => {
            console.log(response);
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
              const dob = dateFormat(response.data.dob);
              userStore.setDob(dob ?? '');
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
        }

        if (selectedImage !== userStore.avatar) {
          // console.log('Image uri:', selectedImage);
          // console.log('Image file:', imageFile);

          // Get image extension
          const fileExtension = selectedImage.split('.').pop();

          let body = new FormData();
          // body.append('file', {
          //   uri: `${selectedImage}`,
          //   name: 'avatar.png',
          //   type: `image/${fileExtension}`,
          // } );
          body.append(
            'file',
            JSON.parse(
              JSON.stringify({
                uri: selectedImage,
                name: `avatar.${fileExtension}`,
                type: `image/${fileExtension}`,
              }),
            ),
          );

          // changeAvatar(imageFile).then(response => {
          //   console.log('Change ava res:', response);
          // });
        }
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
          {/* <Image
            source={{
              uri: selectedImage != '' ? selectedImage : userStore.avatar,
            }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 200 / 2,
              marginTop: 20,
            }}
          /> */}

          <Image
            source={{
              uri:
                selectedImage != ''
                  ? selectedImage
                  : `data:image/jpeg;base64,${userStore.avatar}`,
            }}
            style={{
              width: 200,
              height: 200,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 200 / 2,
              marginTop: 20,
            }}
          />

          <TouchableOpacity
            style={{marginVertical: 10}}
            onPress={async () => {
              await launchImageLibrary(
                // If need base64String, include this option:
                // includeBase64: true
                {mediaType: 'mixed', includeBase64: true},
                response => {
                  // console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    // setImageFile(
                    //   dataURLtoFile(
                    //     `${source?.[0]?.base64}`,
                    //     `${source?.[0]?.fileName}`,
                    //     `${source?.[0]?.type}`,
                    //   ),
                    // );
                    // setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Text>Chỉnh sửa ảnh đại diện</Text>
          </TouchableOpacity>

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
                console.log('Selected dob:', value);

                setOpen(false);
                setDate(value);
                setFieldValue('dob', moment(value).format('DD/MM/YYYY'));

                console.log('Values dob', values.dob);
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
          {/* {touched.dob && errors.dob && (
            <Text style={styles.error}>{errors.dob}</Text>
          )} */}

          <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate(RouteNames.PROFILE as never, {} as never);
            // }}
            onPress={() => handleSubmit()}
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

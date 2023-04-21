import React from 'react';
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

import Icon from 'react-native-vector-icons/Ionicons';

import RouteNames from '../../../../constants/route-names.const';
import {Colors} from '../../../../constants/color.const';
import styles from './styles/styles';

const ProfileSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string().required('Vui lòng nhập số điện thoại'),
  dob: Yup.string().required('Vui lòng nhập ngày sinh'),
});

export default function EditProfileScreen({navigation}: {navigation: any}) {
  return (
    <Formik
      initialValues={{
        email: 'admin@email.com',
        name: 'admin',
        phone: '0953315682',
        dob: '19/11/2001',
      }}
      validationSchema={ProfileSchema}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
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
          {/* <Text style={styles.title}>Đăng nhập</Text> */}
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

          <View style={[styles.inputContainer]}>
            <TextInput
              onChangeText={value => setFieldValue('phone', value)}
              onBlur={() => setFieldTouched('phone')}
              style={{flex: 1}}
              placeholder={'Số điện thoại'}
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
              onChangeText={value => setFieldValue('dob', value)}
              onBlur={() => setFieldTouched('dob')}
              style={{flex: 1}}
              placeholder={'Ngày sinh'}
              value={values.dob}
            />

            {values.dob && (
              <Icon
                onPress={() => setFieldValue('dob', '')}
                name={'close'}
                style={styles.inputIcon}></Icon>
            )}
          </View>
          {touched.dob && errors.dob && (
            <Text style={styles.error}>{errors.dob}</Text>
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteNames.PROFILE as never, {} as never);
            }}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid ? Colors.primary : Colors.disabled,
              },
            ]}>
            <Text style={styles.buttonText}>Lưu thông tin</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

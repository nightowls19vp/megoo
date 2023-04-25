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
import userStore from '../../../../common/store/user.store';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {editInfo} from './services/edit.info.service';
import {IEditInfoRes} from './interfaces/edit.info.interface';

const ProfileSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Email không hợp lệ')
  //   .required('Vui lòng nhập email'),
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string().required('Vui lòng nhập số điện thoại'),
  dob: Yup.string().required('Vui lòng nhập ngày sinh'),
});

export default function EditProfileScreen({navigation}: {navigation: any}) {
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  return (
    <Formik
      initialValues={{
        email: userStore.email,
        name: userStore.name,
        phone: userStore.phone,
        dob: userStore.dob,
      }}
      validationSchema={ProfileSchema}
      onSubmit={values => {
        const dobISOString = moment(values.dob, 'DD/MM/YYYY').toISOString();

        console.log(`Date: ${dobISOString}`);
        // same shape as initial values
        console.log(values);
        editInfo({
          name: values.name,
          phone: values.phone,
          dob: values.dob,
        }).then((response: IEditInfoRes) => {
          console.log(response.statusCode);
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
          {/* <Text style={styles.title}>Đăng nhập</Text> */}
          {/* <View style={[styles.inputContainer]}>
            <TextInput
              editable={false}
              style={{flex: 1}}
              value={values.email}
            />
          </View> */}

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
        </View>
      )}
    </Formik>
  );
}

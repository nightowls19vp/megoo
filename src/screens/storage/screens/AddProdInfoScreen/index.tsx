import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {Colors} from '../../../../constants/color.const';
import GroupProductDropdownPicker from '../../components/GroupProductDropdownPicker';
import PurchaseLocationDropdownPicker from '../../components/PurchaseLocationDropdownPicker';
import StorageLocationDropdownPicker from '../../components/StorageLocationDropdownPicker';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    prodName: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    region: '',
    exp: '',
  };

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
    }
  }, [open]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.image}
          />

          <TouchableOpacity
            style={{
              display: 'flex',
              position: 'absolute',
              right: 20,
              bottom: 0,
            }}
            onPress={async () => {
              launchCamera(
                {
                  mediaType: 'photo',
                  cameraType: 'back',
                },
                response => {
                  console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
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
                  setImageFile(source[0].base64);
                  // console.log('File:', source[0].base64);
                }
              },
            );
          }}>
          <Text style={{color: Colors.text}}>Chỉnh sửa ảnh sản phẩm</Text>
        </TouchableOpacity> */}

        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            console.log('values:', values);
          }}>
          {({
            values,
            errors,
            touched,
            handleSubmit,
            setFieldTouched,
            setFieldValue,
          }) => (
            <View style={styles.infoContainer}>
              <GroupProductDropdownPicker
                navigation={navigation}
                groupId="1"
                zIndex={3000}
                zIndexInverse={1000}
                fnUpdateGpImage={setSelectedImage}
              />
              <Text style={styles.inputLabel}>Loại nhu yếu phẩm</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('category', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('category')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Loại nhu yếu phẩm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.category}
                />

                {values.prodName && (
                  <Icon
                    onPress={() => setFieldValue('type', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Hạn sử dụng</Text>
              <View style={styles.infoInput}>
                <TextInput
                  editable={false}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Hạn sử dụng'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.exp}
                />

                <DatePicker
                  modal
                  open={open}
                  date={selectedDate}
                  mode={'date'}
                  locale={'vi'}
                  title={'Chọn ngày'}
                  confirmText={'Chọn'}
                  cancelText={'Huỷ'}
                  onConfirm={value => {
                    console.log('Selected exp date:', value);

                    setOpen(false);
                    // setDate(value);
                    setFieldValue('exp', moment(value).format('DD/MM/YYYY'));
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                {values.exp && (
                  <Icon
                    onPress={() => setFieldValue('exp', '')}
                    name={'close'}
                    style={[styles.icon, {marginRight: 5}]}
                  />
                )}
                <Icon
                  onPress={() => {
                    setOpen(true);
                  }}
                  name={'calendar'}
                  style={styles.icon}
                />
              </View>

              <Text style={styles.inputLabel}>Số lượng</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Số lượng'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.description}
                />

                {values.description && (
                  <Icon
                    onPress={() => setFieldValue('description', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Đơn vị tính</Text>

              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Đơn vị tính'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.description}
                />

                {values.description && (
                  <Icon
                    onPress={() => setFieldValue('description', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <StorageLocationDropdownPicker
                navigation={navigation}
                groupId="1"
                zIndex={2000}
                zIndexInverse={2000}
              />

              <PurchaseLocationDropdownPicker
                navigation={navigation}
                groupId="1"
                zIndex={1000}
                zIndexInverse={3000}
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddProdInfoScreen;

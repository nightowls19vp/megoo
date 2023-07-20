import {Formik} from 'formik';
import {observer} from 'mobx-react';
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

const AddGroupProductScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    barcode: '',
    prodName: '',
    price: '',
    region: '',
    brand: '',
    category: '',
    description: '',
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

              // await launchCamera(
              //   // If need base64String, include this option:
              //   // includeBase64: true
              //   {mediaType: 'mixed', includeBase64: true},
              //   response => {
              //     // console.log('Response = ', response);

              //     if (response.didCancel) {
              //       console.log('User cancelled image picker');
              //     } else if (response.errorMessage) {
              //       console.log('ImagePicker Error: ', response.errorMessage);
              //     } else {
              //       let source: Asset[] = response.assets as Asset[];
              //       setSelectedImage(`${source[0].uri}`);
              //       setImageFile(source[0].base64);
              //       // console.log('File:', source[0].base64);
              //     }
              //   },
              // );
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
              <Text style={styles.inputLabel}>Barcode</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('barcode', value);
                  }}
                  onBlur={() => setFieldTouched('barcode')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập barcode'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.barcode}
                />

                {values.barcode && (
                  <Icon
                    onPress={() => setFieldValue('barcode', '')}
                    name={'close'}
                    style={[styles.icon, {marginRight: 5}]}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nhu yếu phẩm</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('prodName', value);
                  }}
                  onBlur={() => setFieldTouched('prodName')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên nhu yếu phẩm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.prodName}
                />

                {values.prodName && (
                  <Icon
                    onPress={() => setFieldValue('prodName', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Giá tiền</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('price', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('price')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập giá tiền'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.price}
                />

                {values.price && (
                  <Icon
                    onPress={() => setFieldValue('price', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nơi sản xuất</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('region', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('region')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập nơi sản xuất'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.region}
                />

                {values.region && (
                  <Icon
                    onPress={() => setFieldValue('region', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nhãn hiệu</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('brand', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('brand')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên nhãn hiệu'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.brand}
                />

                {values.brand && (
                  <Icon
                    onPress={() => setFieldValue('brand', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Phân loại</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('brand', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('brand')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Phân loại nhu yếu phẩm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.brand}
                />

                {values.brand && (
                  <Icon
                    onPress={() => setFieldValue('brand', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Mô tả</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập mô tả'}
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

export default observer(AddGroupProductScreen);

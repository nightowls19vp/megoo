import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

import {Colors} from '../../../../constants/color.const';
import styles from './styles/style';
import {useEffect, useState} from 'react';
import moment from 'moment';

const AddProdInfoScreen = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<any>();

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
    }
  }, [open]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
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
            <Icon name="camera" size={40} color={Colors.text} />
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
          initialValues={{prodName: '', exp: '', type: '', description: ''}}
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
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('prodName', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('prodName')}
                  style={{flex: 1, color: Colors.text}}
                  placeholder={'Tên sản phẩm'}
                  placeholderTextColor={Colors.secondary}
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

              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('type', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('type')}
                  style={{flex: 1, color: Colors.text}}
                  placeholder={'Loại sản phẩm'}
                  placeholderTextColor={Colors.secondary}
                  value={values.type}
                />

                {values.prodName && (
                  <Icon
                    onPress={() => setFieldValue('type', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <View style={styles.infoInput}>
                <TextInput
                  editable={false}
                  style={{flex: 1, color: Colors.text}}
                  placeholder={'Hạn sử dụng'}
                  placeholderTextColor={Colors.secondary}
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

              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text}}
                  placeholder={'Ghi chú'}
                  placeholderTextColor={Colors.secondary}
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
      </View>
    </ScrollView>
  );
};

export default AddProdInfoScreen;

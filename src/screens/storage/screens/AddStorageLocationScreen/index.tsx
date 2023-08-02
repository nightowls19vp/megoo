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
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal/dist/modal';
import Icon from 'react-native-vector-icons/Ionicons';

import AddImageModal from '../../../../common/components/AddImageModal';
import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    storageName: '',
    description: '',
  };

  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();
  const [modalState, setModalState] = useState(false);

  const renderAddImageModal = (title: string, modalState: boolean) => {
    // trace render
    console.log('renderAddImageModal');

    return (
      <AddImageModal
        key="addImageModal"
        title={title}
        isModalOpen={modalState}
        setIsModalOpen={setModalState}
      />
    );
  };

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  useEffect(() => {
    console.log('modalState:', modalState);
  }, [modalState]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={async () => {
            setModalState(!modalState);
            // await launchImageLibrary(
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
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.image}
          />

          <View
            style={{
              display: 'flex',
              position: 'absolute',
              right: 20,
              bottom: 0,
            }}>
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </View>
        </TouchableOpacity>
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
              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: Colors.title.orange,
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 10,
                }}>
                Vị trí lưu trữ
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('storageName', value);
                  }}
                  onBlur={() => setFieldTouched('storageName')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Vị trí lưu trữ'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.storageName}
                />

                {values.storageName && (
                  <Icon
                    onPress={() => setFieldValue('storageName', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>
              {errors.storageName && touched.storageName && (
                <Text
                  style={{
                    width: '90%',
                    color: Colors.text.red,
                    textAlign: 'left',
                  }}>
                  {errors.storageName}
                </Text>
              )}

              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: Colors.title.orange,
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 10,
                }}>
                Mô tả
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Mô tả'}
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
              {errors.description && touched.description && (
                <Text
                  style={{
                    width: '90%',
                    color: Colors.text.red,
                    textAlign: 'left',
                  }}>
                  {errors.description}
                </Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        {renderAddImageModal('Chọn ảnh', modalState)}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddProdInfoScreen;

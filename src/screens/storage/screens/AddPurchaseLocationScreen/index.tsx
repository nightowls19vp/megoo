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
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import GroupProductDropdownPicker from '../../components/GroupProductDropdownPicker';
import PurchaseLocationDropdownPicker from '../../components/PurchaseLocationDropdownPicker';
import StorageLocationDropdownPicker from '../../components/StorageLocationDropdownPicker';
import {IDistrict} from '../../interfaces/base-dto/district.interfaces';
import {IProvince} from '../../interfaces/base-dto/province.interface';
import {IWard} from '../../interfaces/base-dto/ward.interface';
import DistrictsDropdownPicker from './components/districts-dropdown-picker';
import ProvincesDropdownPicker from './components/provinces-dropdown-picker';
import WardsDropdownPicker from './components/wards-dropdown-picker';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    name: '',
    addressLine1: '',
  };

  const [p, setP] = useState<IProvince>();
  const [d, setD] = useState<IDistrict>();
  const [w, setW] = useState<IWard>();

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  useEffect(() => {
    setD(undefined);
    setW(undefined);
  }, [p]);

  useEffect(() => {
    setW(undefined);
  }, [d]);

  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();

  const renderProvinceDropdownPicker = (p?: IProvince) => {
    return (
      <ProvincesDropdownPicker
        zIndex={1000}
        zIndexInverse={3000}
        fnUpdateProvince={setP}
        key={'province-dropdown-picker'}
      />
    );
  };

  const renderDistrictDropdownPicker = (d?: IDistrict, p?: number) => {
    return (
      <DistrictsDropdownPicker
        zIndex={2000}
        zIndexInverse={2000}
        disabled={!p}
        pCode={p}
        fnUpdateDistrict={setD}
        key={
          'district-dropdown-picker-for-province-' + p ||
          'district-dropdown-picker-for-province-'
        }
      />
    );
  };

  const renderWardDropdownPicker = (w?: IWard, d?: number) => {
    return (
      <WardsDropdownPicker
        zIndex={3000}
        zIndexInverse={1000}
        dCode={d}
        disabled={!d}
        fnUpdateWard={setW}
        key={
          'ward-dropdown-picker-for-district-' + d ||
          'ward-dropdown-picker-for-district-'
        }
      />
    );
  };

  return (
    <ScrollView
    // contentContainerStyle={styles.container}
    // nestedScrollEnabled={true}
    >
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: selectedImage ?? imageFile ?? IMAGE_URI_DEFAULT,
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
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </TouchableOpacity>
        </View>

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
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  color: Colors.text.orange,
                  // marginBottom: 10,
                }}>
                Tên địa điểm
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('name', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('name')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên địa điểm ...'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.name}
                />

                {values.name && (
                  <Icon
                    onPress={() => setFieldValue('name', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              {renderProvinceDropdownPicker(p)}

              {renderDistrictDropdownPicker(d, p?.code)}

              {renderWardDropdownPicker(w, d?.code)}

              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  color: Colors.text.orange,
                  marginTop: 10,
                }}>
                Địa chỉ chi tiết
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('addressLine1', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('addressLine1')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập địa chỉ chi tiết ...'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.addressLine1}
                />

                {values.addressLine1 && (
                  <Icon
                    onPress={() => setFieldValue('addressLine1', '')}
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

export default AddProdInfoScreen;

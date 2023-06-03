import {useState} from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';

const StorageLocationScreen = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState<object[]>([]);

  const renderLocationItem = () => {
    return locations.map((location: any, index) => {
      return (
        <TouchableOpacity
          style={styles.locationItem}
          key={index}
          onPress={() => {
            navigation.navigate(RouteNames.PRODUCTS, {});
          }}>
          <Image
            source={{
              uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
            }}
            style={styles.locationImg}
          />
          <View style={styles.locationInfoContainer}>
            <View style={styles.locationInfoRow}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Nơi lưu trữ:
              </Text>
              <Text style={styles.text}>{location.location}</Text>
            </View>
            <View style={[styles.locationInfoRow, {width: '70%'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Ghi chú:
              </Text>
              <Text style={styles.text} numberOfLines={3}>
                {location.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Nơi lưu trữ</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="add-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 5,
            }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '15%',
                }}
              />
              <Text
                style={{
                  width: '70%',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}>
                Thêm nơi lưu trữ
              </Text>
              <TouchableOpacity
                style={{
                  width: '15%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icon
                  name="close"
                  size={22}
                  color={Colors.primary}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                  }}
                />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{location: '', description: ''}}
              onSubmit={values => {
                console.log('values:', values);
                setModalVisible(false);
                setLocations(prevLocations => [
                  ...prevLocations,
                  {
                    location: values.location,
                    description: values.description,
                  },
                ]);

                console.log('locations:', locations);
              }}>
              {({
                values,
                errors,
                touched,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
              }) => (
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                      borderColor: Colors.secondary,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    <TextInput
                      onChangeText={value => {
                        setFieldValue('location', value);
                      }}
                      // onSubmitEditing={handleSubmit}
                      onBlur={() => setFieldTouched('location')}
                      style={{flex: 1, color: Colors.text}}
                      placeholder={'Vị trí lưu trữ'}
                      placeholderTextColor={Colors.secondary}
                      value={values.location}
                    />

                    {values.location && (
                      <Icon
                        onPress={() => setFieldValue('location', '')}
                        name={'close'}
                        style={{
                          fontWeight: '200',
                          color: Colors.secondary,
                          fontSize: 20,
                        }}></Icon>
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                      borderColor: Colors.secondary,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
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
                        style={{
                          fontWeight: '200',
                          color: Colors.secondary,
                          fontSize: 20,
                        }}></Icon>
                    )}
                  </View>

                  <TouchableOpacity
                    style={{
                      width: '40%',
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.primary,
                      borderRadius: 10,
                    }}
                    onPress={handleSubmit}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Lưu
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.locationContainer}>
        {/* <TouchableOpacity style={styles.locationItem}>
          <Image
            source={{
              uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
            }}
            style={styles.locationImg}
          />
          <View style={styles.locationInfoContainer}>
            <View style={styles.locationInfoRow}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Nơi lưu trữ:
              </Text>
              <Text style={styles.text}>Tủ bếp</Text>
            </View>
            <View style={[styles.locationInfoRow, {width: '70%'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: 'bold',
                  },
                ]}>
                Ghi chú:
              </Text>
              <Text style={styles.text} numberOfLines={3}>
                Lầu 1, bên trái, tủ thứ 3, ngăn số 2, góc trong cùng bên phải
                Lầu 1, bên trái, tủ thứ 3, ngăn số 2, góc trong cùng bên phải
              </Text>
            </View>
          </View>
        </TouchableOpacity> */}
        {renderLocationItem()}
      </ScrollView>
      {/* {locations.length > 0 ? {} : null } */}
    </View>
  );
};

export default StorageLocationScreen;

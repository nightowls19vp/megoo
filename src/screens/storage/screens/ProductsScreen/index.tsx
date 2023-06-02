import {useEffect, useState} from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

import {Colors} from '../../../../constants/color.const';
import styles from './styles/styles';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<object[]>([]);

  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  // Here is where useScanBarcodes() hook is called.
  // Specify your barcode format inside.
  // Detected barcodes are assigned into the 'barcodes' variable.
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  // Permissions added here.
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const onSuccess = (e: any) => {
    console.log('onSuccess', e);
  };

  const renderLocationItem = () => {
    return (
      <TouchableOpacity
        style={{
          width: '90%',
          backgroundColor: Colors.background,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'center',
          // padding: 10,
        }}>
        <Image
          source={{
            uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
          }}
          style={styles.locationImg}
        />
        <View
          style={{
            display: 'flex',
            gap: 10,
            padding: 10,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>Tên sản phẩm: </Text>
            <Text style={{}}>Sữa</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>Số lượng: </Text>
            <Text style={{}}>3 lóc</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>Hạn sử dụng: </Text>
            <Text style={{}}>1 năm</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.title}>Danh sách sản phẩm</Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.primary}
          />
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
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
                color: Colors.primary,
              }}>
              Thêm nơi lưu trữ
            </Text>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
                marginBottom: 10,
                // backgroundColor: 'pink',
              }}>
              <TouchableOpacity
                style={{
                  width: '45%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
                onPress={() => {
                  return (
                    device != null &&
                    hasPermission && (
                      <>
                        <Camera
                          style={StyleSheet.absoluteFill}
                          device={device}
                          isActive={true}
                          frameProcessor={frameProcessor}
                          frameProcessorFps={5}
                        />
                        {barcodes.map((barcode, idx) => (
                          <View key={idx} style={{padding: 50}}>
                            <Text style={styles.barcodeTextURL}>
                              {barcode.displayValue}
                            </Text>
                          </View>
                        ))}
                      </>
                    )
                  );
                }}>
                <AntDesignIcon
                  name="barcode"
                  size={30}
                  color={Colors.primary}
                />
                <Text style={{fontWeight: 'bold', color: Colors.primary}}>
                  Quét barcode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: '45%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}>
                <AntDesignIcon name="edit" size={30} color={Colors.primary} />
                <Text style={{fontWeight: 'bold', color: Colors.primary}}>
                  Nhập thông tin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {renderLocationItem()}
    </View>
  );
};

export default ProductsScreen;

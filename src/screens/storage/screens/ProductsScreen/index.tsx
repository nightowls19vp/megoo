import {useCallback, useEffect, useState} from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import RouteNames from '../../../../constants/route-names.const';
import {Colors} from '../../../../constants/color.const';
import styles from './styles/styles';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<object[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const openCamera = useCallback(() => {
    setModalVisible(false);
    setShowCamera(true);
  }, []);

  const renderCamera = () => {
    if (!showCamera) {
      return <View style={{flex: 1}} />;
    } else if (!device) {
      return <Text>No camera device available</Text>;
    } else {
      return (
        <View>
          <Camera
            style={{flex: 1, width: '100%', height: '100%'}}
            device={device}
            isActive={true}
            enableZoomGesture
          />
        </View>
      );
    }
  };

  const renderLocationItem = () => {
    return (
      <TouchableOpacity style={styles.productItemContainer}>
        <Image
          source={{
            uri: 'https://wonder-day.com/wp-content/uploads/2022/03/wonder-day-cute-drawings-11.jpg',
          }}
          style={styles.prodImg}
        />
        <View style={styles.productInfoContainer}>
          <View style={styles.productInfo}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Tên sản phẩm:{' '}
            </Text>
            <Text style={styles.text} numberOfLines={3}>
              Sữa abcdefghijklmnopqrstuvw
            </Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Số lượng: </Text>
            <Text style={styles.text}>3 lóc</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Hạn sử dụng:{' '}
            </Text>
            <Text style={styles.text}>1 năm</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Danh sách sản phẩm</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('open modal add product');

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
        <View style={styles.modal}>
          <View style={styles.modalContentContainer}>
            <View style={styles.modalTitleContainer}>
              <View
                style={{
                  width: '15%',
                }}
              />
              <Text style={styles.modalTitle}>Thêm sản phẩm</Text>
              <TouchableOpacity
                style={{
                  width: '15%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Ionicons
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

            <View style={styles.modalOptionsContainer}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(RouteNames.SCAN_BARCODE, {});
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
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(
                    RouteNames.ADD_PRODUCT_INFO as never,
                    {} as never,
                  );
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

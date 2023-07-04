import moment from 'moment';
import {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import {useRoute} from '@react-navigation/native';

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IItem} from '../../interfaces/base-dto/item.interface';
import * as i from '../../services/items.service';
import {
  PropsProductsScreen,
  RouteParamsProductsScreen,
} from './props-products-screen';
import styles from './styles/styles';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<PropsProductsScreen>();
  console.log('route:', JSON.stringify(route, null, 2));

  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
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

    // fetch the first 10 items
    i.getItemPaginated({
      groupId: route?.params?.groupId || '1',

      // limit: 10,
    }).then(res => {
      setItems(res.data);
    });
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

  const renderItems = () => {
    return items.map(item => {
      return (
        <TouchableOpacity style={styles.productItemContainer} key={item.id}>
          <Image
            source={{
              uri:
                item?.image ||
                'https://res.cloudinary.com/nightowls19vp/image/upload/v1687419179/default.png',
            }}
            style={styles.prodImg}
          />
          <View style={styles.productInfoContainer}>
            <View style={styles.productInfo}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Tên sản phẩm:{' '}
              </Text>
              <Text style={styles.text} numberOfLines={3}>
                {item?.groupProduct?.name || 'Chưa có tên sản phẩm'}
              </Text>
            </View>
            {item?.quantity ? (
              <View style={styles.productInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Số lượng:{' '}
                </Text>
                <Text style={styles.text}>
                  {item?.quantity} {item?.unit || ''}
                </Text>
              </View>
            ) : (
              false
            )}
            {item?.bestBefore ? (
              <View style={styles.productInfo}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Hạn sử dụng:{' '}
                </Text>
                <Text style={styles.text}>
                  {moment(item?.bestBefore).isValid()
                    ? moment(item?.bestBefore).format('DD-MM-YYYY')
                    : item?.bestBefore.toString()}
                </Text>
              </View>
            ) : (
              false
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: 50,
      }}>
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
      <ScrollView contentContainerStyle={styles.container}>
        {renderItems()}
      </ScrollView>
    </View>
  );
};

export default ProductsScreen;

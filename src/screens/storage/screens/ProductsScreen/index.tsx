import {observer} from 'mobx-react';
import moment from 'moment';
import {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
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

import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import searchStore from '../../../../common/store/search.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IItem} from '../../interfaces/base-dto/item.interface';
import {
  IGetItemsPaginatedReq,
  IGetItemsPaginatedRes,
} from '../../interfaces/items';
import * as i from '../../services/items.service';
import {
  PropsProductsScreen,
  RouteParamsProductsScreen,
} from './props-products-screen';
import styles from './styles/styles';

import _, {set} from 'lodash';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<PropsProductsScreen>();
  console.log('route:', JSON.stringify(route, null, 2));

  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [reqDto, setReqDto] = useState<IGetItemsPaginatedReq>({
    groupId: groupStore.id,
    page: 1,
    limit: 5,
    search: '',
    searchBy: ['groupProduct.name'],
    sortBy: ['groupProduct.name:ASC', 'timestamp.createdAt:ASC'],
    filter: {
      'timestamp.deletedAt': '$not:$eq:$null',
    },
  });

  const [resDto, setResDto] = useState<IGetItemsPaginatedRes>({
    data: [],
    message: '',
    statusCode: 0,
    links: {},
    meta: {},
  });

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const fetchMoreData = () => {
    console.log('fetchMoreData');

    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    if (!resDto?.links?.next) {
      return;
    }

    reqDto.page = reqDto.page! + 1;

    // fetch the first 10 items
    i.getItemPaginated(reqDto).then(res => {
      console.log('res getItemPaginated: ', res.data.length);
      setResDto(_.cloneDeep(res));

      setItems([...items, ...res.data]);
    });
  };

  useEffect(() => {
    requestCameraPermission();

    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    // fetch the first 10 items
    i.getItemPaginated(reqDto).then(res => {
      console.log('res getItemPaginated: ', res.data.length);
      setResDto(_.cloneDeep(res));

      setItems(_.cloneDeep(res.data));
    });

    // reset searchActive when unmount
    return () => {
      appStore.setSearchActive(false);
    };
  }, []);

  // listen to the search text change
  useEffect(() => {
    console.log('search text changed, ', searchStore.searchText);
    if (searchStore.isPerformingSearch) {
      // search result changed
      console.log('btn search pressed, ready to perform searching');

      // reset page to 1
      setReqDto(prevReqDto => ({
        ...prevReqDto,
        page: 1,
        search: searchStore.searchText,
      }));

      i.getItemPaginated({
        ...reqDto,
        page: 1,
        search: searchStore.searchText,
      }).then(res => {
        console.log('res getItemPaginated: ', res.data.length);
        setResDto(_.cloneDeep(res));

        setItems(_.cloneDeep(res.data));
      });

      // reset search text and isPerformingSearch
      searchStore.setSearchText('');
      searchStore.setIsPerformingSearch(false);
    }
  }, [searchStore.searchText, searchStore.isPerformingSearch]);

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

  const renderItem = (item: IItem) => {
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
            <Text style={styles.infoText} numberOfLines={3}>
              {item?.groupProduct?.name || 'Chưa có tên sản phẩm'}
            </Text>
          </View>
          {item?.quantity ? (
            <View style={styles.productInfo}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Số lượng:{' '}
              </Text>
              <Text style={styles.infoText}>
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
              <Text style={styles.infoText}>
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
            color={Colors.text.orange}
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
                  color={Colors.text.orange}
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
                  color={Colors.icon.orange}
                />
                <Text style={{fontWeight: 'bold', color: Colors.text.orange}}>
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
                <AntDesignIcon
                  name="edit"
                  size={30}
                  color={Colors.icon.orange}
                />
                <Text style={{fontWeight: 'bold', color: Colors.text.orange}}>
                  Nhập thông tin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={items}
        keyExtractor={item =>
          item?.id?.toString() ?? new Date().getTime().toString()
        }
        renderItem={({item}) => renderItem(item)}
        contentContainerStyle={styles.container}
        onEndReached={fetchMoreData} // Add your function to fetch more data here
        onEndReachedThreshold={0.2} // Adjust the threshold as needed
      />
    </View>
  );
};

export default observer(ProductsScreen);

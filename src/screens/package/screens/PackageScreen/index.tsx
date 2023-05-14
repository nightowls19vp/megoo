import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

import styles from './styles/style';
import {getAllPackage, updateCart} from './services/package.service';
import {Colors} from '../../../../constants/color.const';
import packageStore from '../../../../common/store/package.store';
import {
  ICartItem,
  ICartList,
} from '../../../../common/interfaces/package.interface';
import userStore from '../../../../common/store/user.store';
import Toast from 'react-native-toast-message';

const PackageScreen = () => {
  const [packages, setPackages] = useState([]);

  const getPackages = async () => {
    const pkgs = await getAllPackage();
    setPackages(pkgs.data);
  };

  useEffect(() => {
    getPackages();
  }, []);

  const width = Dimensions.get('window').width;

  const renderItem = ({item}: {item: any}) => {
    // console.log('packages:', item);
    const [noOfMemb, setNoOfMemb] = useState(item.noOfMember);
    const [duration, setDuration] = useState(item.duration);
    const [totalPrice, setTotalPrice] = useState(
      item.duration >= 12
        ? item.coefficient === undefined
          ? item.price
          : (item.price + item.noOfMember * item.duration * item.coefficient) *
            0.7
        : item.price + item.noOfMember * item.duration * item.coefficient,
    );

    const calculatePrice = () => {
      if (item.name === 'Family Package') {
        let price = (item.price + item.noOfMember * item.duration * 0) * 0.7;

        setTotalPrice(price);
      } else if (item.name === 'Customized Package') {
        let price =
          duration >= 12
            ? (item.price + noOfMemb * duration * item.coefficient) * 0.7
            : item.price + noOfMemb * duration * item.coefficient;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else {
        let price =
          item.duration >= 12
            ? (item.price + noOfMemb * item.duration * item.coefficient) * 0.7
            : item.price + noOfMemb * item.duration * item.coefficient;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      }
    };

    useEffect(() => {
      calculatePrice();
    }, [noOfMemb, duration]);

    return (
      <View style={styles.carouselItemContainer} key={item._id}>
        <View style={styles.carouselItem}>
          <View>
            <Text style={styles.pkgTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <View
              style={
                styles.infoRow
                // {
                //   display: 'flex',
                //   alignItems: 'center',
                //   justifyContent: 'center',
                //   marginVertical: 10,
                // }
              }>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {duration !== item.duration ? duration : item.duration} tháng
              </Text>
            </View>
            {item.name === 'Customized Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={duration !== item.duration ? duration : item.duration}
                minimumValue={0}
                maximumValue={12}
                lowerLimit={1}
                onValueChange={value => {
                  setDuration(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember}{' '}
                người
              </Text>
            </View>
            {item.name !== 'Family Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={
                  noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember
                }
                minimumValue={0}
                maximumValue={10}
                lowerLimit={1}
                onValueChange={value => {
                  setNoOfMemb(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Giá tiền: </Text>
              <Text style={[styles.text, {fontSize: 24, fontWeight: 'bold'}]}>
                {totalPrice} VND
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text style={styles.text}>Mô tả:</Text>
              <Text
                style={[
                  styles.text,
                  {textAlign: 'center', fontWeight: 'bold'},
                ]}>
                {item.description}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let cartItem: ICartItem = {
                  package: item._id,
                  quantity: 1,
                  noOfMemb: noOfMemb,
                  duration: duration,
                };
                userStore.addPackage(cartItem);

                const response = await updateCart(userStore.cartList);
                console.log('Update cart res:', response.statusCode);

                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Thêm vào giỏ hàng thành công',
                    autoHide: true,
                    visibilityTime: 2000,
                    topOffset: 30,
                    bottomOffset: 40,
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: response.message,
                    autoHide: false,
                    topOffset: 30,
                    bottomOffset: 40,
                  });
                }
              }}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Mua ngay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Only show this item when user buy a package */}
      {packageStore.id ? (
        <View style={styles.packageContainer}>
          (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Gói hiện tại</Text>
              <TouchableOpacity>
                <Text
                  onPress={() => {
                    // navigation.navigate(
                    //   RouteNames.EDIT_PROFILE as never,
                    //   {} as never,
                    // );
                  }}
                  style={styles.detailText}>
                  Chi tiết
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <Text>Tên gói</Text>
              <Text>Ngày mua</Text>
              <Text>Thời hạn</Text>
              <Text>Giá tiền</Text>
              <Text>Số lượng thành viên</Text>
            </View>
          </>
          )
        </View>
      ) : null}
      <View style={{marginBottom: 20}}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Các gói người dùng</Text>
          <TouchableOpacity>
            <Text
              onPress={() => {
                // navigation.navigate(
                //   RouteNames.EDIT_PROFILE as never,
                //   {} as never,
                // );
              }}
              style={styles.detailText}>
              Xem tất cả
            </Text>
          </TouchableOpacity>
        </View>

        <Carousel
          loop={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 120,
          }}
          width={width * 0.9}
          height={width * 1.3}
          //   autoPlay={true}
          data={packages}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={renderItem}
        />
      </View>

      <Toast position="top"></Toast>
    </ScrollView>
  );
};

export default PackageScreen;

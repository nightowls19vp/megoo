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
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

import styles from './styles/style';
import {getAllPackage} from './services/package.service';
import {Colors} from '../../../../constants/color.const';

const PackageScreen = () => {
  const [packages, setPackages] = useState([]);

  const getPackages = async () => {
    const pkgs = await getAllPackage();
    console.log('pkgs:', pkgs.data);
    setPackages(pkgs.data);
  };

  useEffect(() => {
    getPackages();
  }, []);

  const width = Dimensions.get('window').width;

  const renderItem = ({item}: {item: any}) => {
    console.log('packages:', item);

    return (
      <View style={styles.carouselItem} key={item._id}>
        {/* <Image
          source={{uri: item.illustration}}
          style={{width: '100%', height: '100%'}}
        /> */}
        <View
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.pkgTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.infoRow}>
              <Text>Thời hạn:</Text>
              <Text>{item.duration} tháng</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>Giá tiền: </Text>
              <Text>{item.price} VND</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text>Mô tả:</Text>
              {/* numberOfLines={5} */}
              <Text>{item.description}</Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 10,
                // borderRadius: 10,
                // backgroundColor: Colors.primary,
                padding: 8,
              }}>
              <Icon
                name={'shoppingcart'}
                style={{fontSize: 24, color: Colors.primary}}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.primary,
                  fontWeight: 'bold',
                }}>
                Mua gói
              </Text>
            </TouchableOpacity>
            {/* <FeatherIcon name={'shopping-cart'} style={{fontSize: 30}} /> */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
      }}>
      <View style={styles.packageContainer}>
        <Text style={styles.title}>Gói hiện tại</Text>
        <View style={styles.contentContainer}>
          <Text>Tên gói</Text>
          <Text>Ngày mua</Text>
          <Text>Thời hạn</Text>
          <Text>Giá tiền</Text>
          <Text>Số lượng thành viên</Text>
        </View>
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={styles.title}>Các gói người dùng</Text>
        <Carousel
          loop={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 120,
          }}
          width={width * 0.9}
          height={width * 0.85}
          //   autoPlay={true}
          data={packages}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

export default PackageScreen;

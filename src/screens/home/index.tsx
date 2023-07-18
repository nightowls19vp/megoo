import {Dimensions, ScrollView} from 'react-native';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import RouteNames from '../../constants/route-names.const';
import {Colors} from '../../constants/color.const';
import Carousel from 'react-native-reanimated-carousel';
import {useEffect, useState} from 'react';
import {getAllPackage} from '../package/screens/PackageScreen/services/package.service';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const HomeScreen = ({navigation}: {navigation: any}) => {
  const [packages, setPackages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getPackages = async () => {
    const pkgs = await getAllPackage();
    setPackages(pkgs.data);
  };

  useEffect(() => {
    getPackages();
  }, []);

  const renderItem = ({item}: {item: any}) => {
    const [noOfMemb, setNoOfMemb] = useState(item.noOfMember);
    const [duration, setDuration] = useState(item.duration);
    const [totalPrice, setTotalPrice] = useState(item.price);

    const calculatePrice = () => {
      if (item.name === 'Family Package') {
        let price = (item.price + item.noOfMember * item.duration * 0) * 0.7;

        setTotalPrice(price);
      } else if (item.name === 'Customized Package') {
        let price =
          duration >= 12
            ? (item.price + (noOfMemb - 2) * duration * item.coefficient) * 0.7
            : item.price + (noOfMemb - 2) * duration * item.coefficient;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Annual Package') {
        let price =
          (item.price + (noOfMemb - 2) * item.duration * item.coefficient) *
          0.7;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Experience Package') {
        let price =
          item.price + (noOfMemb - 2) * item.duration * item.coefficient;

        setTotalPrice(price);
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

            <View style={styles.infoRow}>
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
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
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
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
                lowerLimit={2}
                onValueChange={value => {
                  console.log('slider noofmemb value', value);

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
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Mua ngay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Thêm vào {'\n'}giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.utilitiesContainer}>
        <Text style={styles.title}>Gói người dùng</Text>
        <Carousel
          loop={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 50,
          }}
          width={width * 0.9}
          height={height * 0.6}
          // autoPlay={true}
          data={packages}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={renderItem}
        />
      </View> */}
      <View style={styles.utilitiesContainer}>
        <Text style={styles.title}>Tiện ích</Text>
        <View style={styles.utilitiesContent}>
          <TouchableOpacity
            style={styles.utility}
            onPress={() => navigation.navigate(RouteNames.BILL_LIST_STACK, {})}>
            <Text style={styles.utilityText}>Quản lý chi tiêu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utility}
            onPress={() =>
              navigation.navigate(RouteNames.TODOS_LIST_STACK, {})
            }>
            <Text style={styles.utilityText}>Việc cần làm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utility}
            onPress={() => navigation.navigate(RouteNames.TASK_LIST_STACK, {})}>
            <Text style={styles.utilityText}>Quản lý thời gian</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'pink',
  },
  text: {
    fontSize: 16,
    color: Colors.text.grey,
  },
  title: {
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  utilitiesContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  utilitiesContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: 10,
    // marginBottom: 10,
    flexWrap: 'wrap',
  },
  utility: {
    minWidth: '47.5%',
    padding: 20,
    display: 'flex',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderColor: Colors.border.orange,
    borderWidth: 1,
    marginBottom: 20,
  },
  utilityText: {
    fontSize: 16,
    color: Colors.text.orange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselItemContainer: {
    width: width * 0.7,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  carouselItem: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 5,
  },
  pkgTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.orange,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // backgroundColor: 'yellow',
    gap: 10,
    // marginHorizontal: 15,
  },
  button: {
    width: 110,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    padding: 5,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.buttonText.orange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default HomeScreen;

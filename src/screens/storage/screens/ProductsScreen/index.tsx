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

import {Colors} from '../../../../constants/color.const';
import styles from './styles/styles';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const [products, setProducts] = useState<object[]>([]);

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
        <TouchableOpacity onPress={() => {}}>
          <Icon name="add-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {renderLocationItem()}
    </View>
  );
};

export default ProductsScreen;

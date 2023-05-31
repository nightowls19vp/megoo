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
import styles from './styles/style';

const ProductDetailScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState<object[]>([]);

  const renderLocationItem = () => {};

  return (
    <View style={styles.container}>
      <Text>Product detail</Text>
    </View>
  );
};

export default ProductDetailScreen;

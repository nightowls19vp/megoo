import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import styles from './styles/style';

const ProductDetailScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState<object[]>([]);

  const renderLocationItem = () => {};

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Product detail</Text>
    </View>
  );
};

export default ProductDetailScreen;

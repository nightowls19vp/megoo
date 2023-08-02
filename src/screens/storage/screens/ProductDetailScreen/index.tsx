import {useState, useEffect} from 'react';

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
import {RouteProp, useRoute} from '@react-navigation/native';

// Define the type for the route params
type GroupDetailRouteParams = {
  groupId: string;
  itemId: string;
};

// Specify the type for the route
type GroupDetailRouteProp = RouteProp<
  Record<string, GroupDetailRouteParams>,
  string
>;

const ProductDetailScreen = () => {
  const route = useRoute<GroupDetailRouteProp>();
  const {groupId, itemId} = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('groupId: ', groupId);
    console.log('itemId: ', itemId);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Product detail</Text>
    </View>
  );
};

export default ProductDetailScreen;

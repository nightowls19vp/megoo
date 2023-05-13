import {View, Text} from 'react-native';
import styles from './styles/style';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text>Tên gói</Text>
        <Text>Thời hạn</Text>
        <Text>Số lượng thành viên</Text>
        <Text>Giá tiền</Text>
      </View>
    </View>
  );
};

export default CartScreen;

import {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  ICartItem,
  IPackage,
} from '../../../../common/interfaces/package.interface';
import {getUserCart} from './services/cart.service';
import styles from './styles/style';

const CartScreen = () => {
  const [cartList, setCartList] = useState([]);

  const getCartList = async () => {
    const cartListRes = await getUserCart();
    setCartList(cartListRes.cart);
    console.log('After update cart res:', cartListRes.cart);
    console.log('After set cart list:', cartList);
  };

  useEffect(() => {
    getCartList();
  }, []);

  const renderCartItem = () => {
    return cartList.map((object: ICartItem, index) => {
      // Perform operations with each object
      console.log(`Object ${index + 1}:`, object);
      // Access object properties like object.duration, object.noOfMemb, etc.
      return (
        <View style={styles.contentContainer} key={index}>
          <Text>Tên gói: {object.package}</Text>
          <Text>Thời hạn: {object.duration}</Text>
          <Text>Số lượng thành viên: {object.noOfMemb}</Text>
          <Text>Giá tiền</Text>
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderCartItem()}
    </ScrollView>
  );
};

export default CartScreen;

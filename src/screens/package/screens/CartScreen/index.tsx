import {useEffect, useRef, useState} from 'react';
import {
  AppState,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import InputSpinner from 'react-native-input-spinner';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RouteNames from '../../../../constants/route-names.const';
import {getUserCart, checkout, getUserById} from './services/cart.service';
import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import userStore from '../../../../common/store/user.store';
import {
  ICartItem,
  ICartList,
} from '../../../../common/interfaces/package.interface';
import {updateCart} from '../PackageScreen/services/package.service';
import Toast from 'react-native-toast-message';

const CartScreen = ({navigation}: {navigation: any}) => {
  const [cartList, setCartList] = useState<any[]>([]);
  const [selectedItemList, setSelectedItemList] = useState<any>({
    cart: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const getCartList = async () => {
    const cartListRes = await getUserCart();

    console.log('cartListRes:', cartListRes);

    if (
      !cartListRes.cart ||
      !cartListRes?.cart?.length ||
      cartListRes?.cart?.length === 0
    ) {
      return [];
    } else {
      const newCartList = cartListRes.cart.map((cartItem: any) => {
        return {
          name: cartItem.name,
          package: cartItem._id,
          duration: cartItem.duration,
          noOfMember: cartItem.noOfMember,
          quantity: cartItem.quantity,
          price: cartItem.price,
        };
      });

      return newCartList;
    }
  };

  useEffect(() => {
    getCartList().then(cartList => {
      setCartList(cartList);
      // setIsInit(true);
    });
  }, []);

  const renderCartItem = () => {
    const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
      cartList.map(() => false),
    );

    const handleToggleCheckBox = (
      index: number,
      newValue: boolean,
      object: {
        package: string;
        name: string;
        quantity: number;
        noOfMember: number;
        duration: number;
      },
    ) => {
      const updatedArray = [...toggleCheckBoxArray];
      updatedArray[index] = newValue;
      setToggleCheckBoxArray(updatedArray);

      let cartItem: any = {
        package: object.package,
        name: object.name,
        quantity: object.quantity,
        noOfMember: object.noOfMember,
        duration: object.duration,
      };

      console.log('item pkg:', cartItem);
      setSelectedItemList(() => ({
        cart: selectedItemList.cart.map((item: any) => {
          return {
            package: item.package,
            name: item.name,
            duration: item.duration,
            noOfMember: item.noOfMember,
            quantity: item.quantity,
          };
        }),
      }));

      if (updatedArray[index] === true) {
        // If the array is empty, add the selected item to the array
        if (selectedItemList.cart.length === 0) {
          setSelectedItemList(() => ({
            cart: [cartItem],
          }));
        } else {
          // If the array is not empty, check if the selected item already exists in the array
          const cartIndex = selectedItemList.cart.findIndex(
            (obj: any) =>
              obj.package === cartItem.package &&
              obj.noOfMember === cartItem.noOfMember &&
              obj.duration === cartItem.duration,
          );

          // If not, add the selected item to the array
          if (cartIndex === -1) {
            setSelectedItemList((prevCartList: any) => ({
              cart: [...prevCartList.cart, cartItem],
            }));
          }
        }

        console.log('selected list:', selectedItemList.cart);

        let price =
          totalPrice + cartList[index].price * cartList[index].quantity;
        setTotalPrice(price);
      } else {
        // If the already selected item is deselected, remove it from the array
        const cartIndex = selectedItemList.cart.findIndex(
          (obj: any) =>
            obj.package === cartItem.package &&
            obj.noOfMember === cartItem.noOfMember &&
            obj.duration === cartItem.duration,
        );

        setSelectedItemList((prevState: any) => ({
          ...prevState,
          cart: prevState.cart.filter(
            (item: any, i: number) => i !== cartIndex,
          ),
        }));

        let price =
          totalPrice + cartList[index].price * cartList[index].quantity;
        setTotalPrice(price);
      }
    };

    return cartList.map((object: any, index) => {
      return (
        <View style={styles.cartListContainer} key={index}>
          <CheckBox
            style={{
              marginLeft: 5,
            }}
            tintColors={{true: Colors.primary}}
            disabled={false}
            value={toggleCheckBoxArray[index]}
            onValueChange={newValue =>
              handleToggleCheckBox(index, newValue, object)
            }
          />
          <View style={styles.cartItemContainer} key={index}>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Tên gói: </Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.name}
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.duration} tháng
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.noOfMember} người
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Số lượng:</Text>

              <NumericInput
                type="plus-minus"
                minValue={1}
                maxValue={50}
                value={object.quantity}
                totalWidth={150}
                totalHeight={35}
                iconStyle={{fontSize: 20, color: '#FFFFFF'}}
                rightButtonBackgroundColor="#32CD32"
                leftButtonBackgroundColor="#FF2400"
                rounded={true}
                textColor={Colors.text}
                inputStyle={{fontSize: 14}}
                onChange={(num: number) => {
                  const index = cartList.findIndex(
                    (cartItem: any) =>
                      cartItem.package === object.package &&
                      cartItem.noOfMember === object.noOfMember &&
                      cartItem.duration === object.duration,
                  );

                  if (index === -1) {
                    cartList.push({...object, quantity: num});
                  } else {
                    cartList[index].quantity = num;
                  }

                  const payload: ICartList = {
                    cart: cartList.map((cartItem: any) => {
                      return {
                        package: cartItem.package,
                        quantity: cartItem.quantity,
                        noOfMember: cartItem.noOfMember,
                        duration: cartItem.duration,
                      };
                    }),
                  };

                  updateCart(payload)
                    .then(async res => {
                      console.log('Update cart after incr:', res.data);
                      const newCartList = await getCartList();
                      setCartList(newCartList);
                    })
                    .catch(error => {
                      console.log('update cart err:', error);
                    });
                }}
              />
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Giá tiền:</Text>
              <Text
                style={[
                  {color: Colors.primary, fontSize: 18, fontWeight: 'bold'},
                ]}>
                {Math.round(object.price * object.quantity)} VND
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        {renderCartItem()}
      </ScrollView>

      <View style={styles.paymentButtonContainer}>
        <View style={styles.icon}>
          <Icon name="shoppingcart" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.price} numberOfLines={2}>
          {Math.round(totalPrice)} VND
        </Text>

        <TouchableOpacity
          onPress={async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            console.log('AT:', accessToken);
            console.log('User id:', userStore.id);
            console.log('Selected item list:', selectedItemList.cart);

            if (selectedItemList.cart.length === 0) {
              Toast.show({
                type: 'error',
                text1: 'Vui lòng chọn gói để thanh toán',
                autoHide: true,
                visibilityTime: 3000,
                topOffset: 30,
                bottomOffset: 40,
              });
            } else {
              navigation.navigate(RouteNames.PAYMENT as never, {
                selectedItems: selectedItemList.cart,
              });
            }
          }}
          style={styles.paymentButton}>
          <Text style={styles.paymentText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
      <Toast position="top"></Toast>
    </View>
  );
};

export default CartScreen;

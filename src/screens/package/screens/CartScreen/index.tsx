import {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Linking} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import InputSpinner from 'react-native-input-spinner';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getUserCart, checkout, getUserById} from './services/cart.service';
import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import userStore from '../../../../common/store/user.store';
import {
  ICartItem,
  ICartList,
} from '../../../../common/interfaces/package.interface';
import {updateCart} from '../PackageScreen/services/package.service';
import {URL_HOST} from '../../../../core/config/api/api.config';
import axios from 'axios';

const CartScreen = () => {
  const [cartList, setCartList] = useState<any[]>([]);
  const [selectedItemList, setSelectedItemList] = useState<ICartList>({
    cart: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [counter, setCounter] = useState(0);

  const getCartList = async () => {
    const cartListRes = await getUserCart();
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
  };

  useEffect(() => {
    console.log('useEffect getCartList');

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
        duration: number;
        noOfMember: number;
        quantity: number;
      },
    ) => {
      const updatedArray = [...toggleCheckBoxArray];
      updatedArray[index] = newValue;
      setToggleCheckBoxArray(updatedArray);

      let cartItem: ICartItem = {
        package: object.package,
        noOfMember: object.noOfMember,
        duration: object.duration,
        quantity: object.quantity,
      };
      console.log('item pkg:', cartItem);

      if (updatedArray[index] === true) {
        // If the array is empty, add the selected item to the array
        if (selectedItemList.cart.length === 0) {
          setSelectedItemList(() => ({
            cart: [cartItem],
          }));
        } else {
          // If the array is not empty, check if the selected item already exists in the array
          const cartIndex = selectedItemList.cart.findIndex(
            obj =>
              obj.package === cartItem.package &&
              obj.noOfMember === cartItem.noOfMember &&
              obj.duration === cartItem.duration,
          );

          // If not, add the selected item to the array
          if (cartIndex === -1) {
            setSelectedItemList(prevCartList => ({
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
          obj =>
            obj.package === cartItem.package &&
            obj.noOfMember === cartItem.noOfMember &&
            obj.duration === cartItem.duration,
        );

        setSelectedItemList(prevState => ({
          ...prevState,
          cart: prevState.cart.filter((item, i) => i !== cartIndex),
        }));

        let price =
          totalPrice - cartList[index].price * cartList[index].quantity;
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
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: 10,
              }}>
              <Text style={styles.text}>Tên gói: </Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.name}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.duration} tháng
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.noOfMember} người
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Text style={styles.text}>Số lượng:</Text>
              {/* <InputSpinner
                max={50}
                min={1}
                step={1}
                value={object.quantity}
                colorPress={Colors.text}
                colorLeft={'#ff6961'}
                colorRight={'#77DD77'}
                delayPressIn={10}
                // skin="modern"
                // rounded={false}
                // showBorder
                height={40}
                fontSize={14}
                width={'40%'}
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
                        duration: cartItem.duration,
                        noOfMember: cartItem.noOfMember,
                        quantity: cartItem.quantity,
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
              /> */}
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
                        duration: cartItem.duration,
                        noOfMember: cartItem.noOfMember,
                        quantity: cartItem.quantity,
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
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: 10,
              }}>
              <Text style={styles.text}>Giá tiền:</Text>
              <Text
                style={[
                  {color: Colors.primary, fontSize: 18, fontWeight: 'bold'},
                ]}>
                {object.price * object.quantity} VND
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

      <View
        style={{
          width: '100%',
          height: 50,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          // paddingHorizontal: 20,
          position: 'absolute',
          bottom: 0,
        }}>
        <View
          style={{
            width: '10%',
            height: '100%',
            paddingLeft: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="shoppingcart" size={30} color={Colors.primary} />
        </View>
        <Text
          style={{
            width: '50%',
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.text,
            textAlign: 'center',
          }}
          numberOfLines={2}>
          {totalPrice} VND
        </Text>

        <TouchableOpacity
          onPress={async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            console.log('AT:', accessToken);
            console.log('User id:', userStore.id);
            console.log('Selected item list:', selectedItemList.cart);

            const response = await checkout(selectedItemList);
            console.log('Checkout response:', response.order);
            Linking.openURL(response.order.order_url);

            // const interValCheck = setInterval(async () => {
            //   const getRes = await getUserById();
            //   console.log('get user res:', getRes);

            //   if (getRes.user.trxHist.length > 0) {
            //     clearInterval(interValCheck);
            //   }
            // }, 30 * 1000);

            // setTimeout(() => {
            //   clearInterval(interValCheck);
            // }, 5 * 60 * 1000);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40%',
            height: '100%',
            backgroundColor: Colors.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.background,
            }}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

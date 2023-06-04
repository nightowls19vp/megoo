import {RouteProp, useRoute, NavigationAction} from '@react-navigation/native';
import {useRef, useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  AppState,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';

import RouteNames from '../../../../constants/route-names.const';
import {checkout, getUserById, renew} from './services/payment.service';
import styles from './styles/style';
import {ICartList} from './../../../../common/interfaces/package.interface';
import {Colors} from '../../../../constants/color.const';
import appStore from '../../../../common/store/app.store';

// Define the type for the route params
type SelectedItemsRouteParams = {
  totalPrice: number;
  selectedItems: [];
};

// Specify the type for the route
type SelectedItemsRouteProp = RouteProp<
  Record<string, SelectedItemsRouteParams>,
  string
>;

const PaymentScreen = ({navigation}: {navigation: any}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const route = useRoute<SelectedItemsRouteProp>();
  const [selectedItemList, setSelectedItemList] = useState<ICartList>({
    cart: [],
  });
  const [itemsInfo, setItemsInfo] = useState<any>({
    cart: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const selectedItems = route.params.selectedItems;

  useEffect(() => {
    setItemsInfo(() => ({
      cart: selectedItems.map((item: any) => {
        return {
          package: item.package,
          name: item.name,
          duration: item.duration,
          noOfMember: item.noOfMember,
          quantity: item.quantity,
          price: item.price,
        };
      }),
    }));

    setSelectedItemList(() => ({
      cart: selectedItems.map((item: any) => {
        return {
          package: item.package,
          duration: item.duration,
          noOfMember: item.noOfMember,
          quantity: item.quantity,
        };
      }),
    }));

    setTotalPrice(route.params.totalPrice);
  }, []);

  const renderItem = () => {
    return itemsInfo.cart.map((item: any, index: any) => {
      return (
        <View
          style={{
            backgroundColor: Colors.background,
            borderRadius: 10,
          }}
          key={index}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              padding: 10,
            }}>
            <Text>Tên gói:</Text>
            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              padding: 10,
            }}>
            <Text>Thời hạn:</Text>
            <Text style={{fontWeight: 'bold'}}>{item.duration} tháng</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              padding: 10,
            }}>
            <Text>Số lượng thành viên:</Text>
            <Text style={{fontWeight: 'bold'}}>{item.noOfMember}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              padding: 10,
            }}>
            <Text>Số lượng gói:</Text>
            <Text style={{fontWeight: 'bold'}}>{item.quantity}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              padding: 10,
            }}>
            <Text>Thành tiền:</Text>
            <Text style={{fontWeight: 'bold'}}>
              {Math.round(item.price)} VND
            </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
            display: 'flex',
            gap: 20,
            paddingBottom: 50,
            marginVertical: 20,
          }}>
          {renderItem()}
        </View>
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
          position: 'absolute',
          bottom: 0,
        }}>
        <Text
          style={{
            width: '60%',
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.text,
            textAlign: 'center',
          }}>
          {totalPrice} VND
        </Text>
        {appStore.isExtendedPkg === false ? (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              console.log('route.params:', itemsInfo);
              const response = await checkout(selectedItemList);
              console.log('Checkout response:', response);
              const order = response.order;
              const trans = response.trans;
              console.log('order res:', order);
              console.log('trans res:', trans);
              const trans_id = response.trans._id;
              console.log('trans_id', trans_id);
              // Toast.show({
              //   type: 'success',
              //   text1: 'Thanh toán thành công',
              //   autoHide: true,
              //   visibilityTime: 3000,
              //   topOffset: 20,
              //   onHide: () => {
              //     navigation.navigate('PROFILE_STACK', {
              //       params: {
              //         screen: 'PROFILE',
              //         activeTab: 'group',
              //       },
              //     });
              //   },
              // });

              // Open URL for payment
              Linking.openURL(response.order.order_url);
              // Linking.openURL(response.data);

              let intervalCheckActive = true;
              let interValCheck = setInterval(async () => {
                if (!intervalCheckActive) {
                  clearInterval(interValCheck);
                  return;
                }

                const getRes = await getUserById();
                console.log('trans id in hist:', getRes.user.trxHist);
                if (getRes.user.trxHist.includes(trans_id)) {
                  console.log(trans_id, 'exists in trxHist');
                  clearInterval(interValCheck);

                  intervalCheckActive = false;
                  appStore.setIsExtendedPkg(false);
                  appStore.setRenewPkg({
                    package: '',
                    noOfMember: 0,
                    duration: 0,
                  });
                }
                if (!intervalCheckActive) {
                  Toast.show({
                    type: 'success',
                    text1: 'Thanh toán thành công',
                    autoHide: true,
                    visibilityTime: 3000,
                    topOffset: 20,
                    onHide: () => {
                      navigation.navigate('PROFILE_STACK', {
                        params: {
                          screen: 'PROFILE',
                          activeTab: 'group',
                        },
                      });
                    },
                  });
                }
              }, 10 * 1000);

              setTimeout(() => {
                clearInterval(interValCheck);
                intervalCheckActive = false;
              }, 2 * 60 * 1000);
            }}>
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              console.log('pkg id:', appStore.renewPkgId);
              console.log('group id:', appStore.renewGroupId);
              // console.log('group duration', appStore.renewPkg.duration);

              const pkg = {
                package: appStore.renewPkg.package,
                noOfMember: appStore.renewPkg.noOfMember,
                duration: appStore.renewPkg.duration,
              };

              const response = await renew(appStore.renewPkg);
              console.log('Renew res:', response);

              const order = response.order;
              const trans = response.trans;
              console.log('order res:', order);
              console.log('trans res:', trans);
              const trans_id = response.trans._id;
              console.log('trans_id', trans_id);
              // Open URL for payment
              Linking.openURL(response.order.order_url);
              let intervalCheckActive = true;
              let interValCheck = setInterval(async () => {
                if (!intervalCheckActive) {
                  clearInterval(interValCheck);
                  return;
                }

                const getRes = await getUserById();
                console.log('trans id in hist:', getRes.user.trxHist);
                if (getRes.user.trxHist.includes(trans_id)) {
                  console.log(trans_id, 'exists in trxHist');
                  clearInterval(interValCheck);

                  intervalCheckActive = false;
                  appStore.setIsExtendedPkg(false);
                  appStore.setRenewPkg({
                    package: '',
                    noOfMember: 0,
                    duration: 0,
                  });
                }
                if (!intervalCheckActive) {
                  Toast.show({
                    type: 'success',
                    text1: 'Gia hạn thành công',
                    autoHide: true,
                    visibilityTime: 3000,
                    topOffset: 20,
                    onHide: () => {
                      navigation.navigate('PROFILE_STACK', {
                        params: {
                          screen: 'PROFILE',
                          activeTab: 'group',
                        },
                      });
                    },
                  });
                }
              }, 10 * 1000);

              setTimeout(() => {
                clearInterval(interValCheck);
                intervalCheckActive = false;
              }, 2 * 60 * 1000);
            }}>
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            console.log('route.params:', itemsInfo);
            const response = await checkout(selectedItemList);
            console.log('Checkout response:', response);
            const order = response.order;
            const trans = response.trans;
            console.log('order res:', order);
            console.log('trans res:', trans);
            const trans_id = response.trans._id;
            console.log('trans_id', trans_id);
            // Open URL for payment
            Linking.openURL(response.order.order_url);
            const subscription = AppState.addEventListener(
              'change',
              nextAppState => {
                if (appState.current.match(/inactive|background/)) {
                  console.log('Get user running in background');
                }
                if (
                  appState.current.match(/inactive|background/) &&
                  nextAppState === 'active'
                ) {
                  console.log('App has come to the foreground!');
                  // Check if trans_id exists in user's trxHist then user paid successfully
                  const interValCheck = setInterval(async () => {
                    const getRes = await getUserById();
                    console.log('get user res:', getRes);
                    console.log('trans id in hist:', getRes.user.trxHist);
                    if (getRes.user.trxHist.includes(trans_id)) {
                      console.log(trans_id, 'exists in trxHist');
                      clearInterval(interValCheck);
                      Toast.show({
                        type: 'success',
                        text1: 'Thanh toán thành công',
                        autoHide: true,
                        visibilityTime: 1000,
                        topOffset: 30,
                        bottomOffset: 40,
                        onHide: () => {
                          navigation.navigate(RouteNames.PROFILE as never, {
                            activeTab: 'group',
                          });
                        },
                      });
                    }
                  }, 10 * 1000);
                  setTimeout(() => {
                    clearInterval(interValCheck);
                  }, 2 * 60 * 1000);
                }
                appState.current = nextAppState;
                setAppStateVisible(appState.current);
                console.log('AppState', appState.current);
              },
            );
            return () => {
              subscription.remove();
            };
          }}>
          <Text style={styles.buttonText}>Thanh toán</Text>
        </TouchableOpacity> */}
      </View>
      <Toast position="top" />
    </>
  );
};

export default PaymentScreen;

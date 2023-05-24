import {RouteProp, useRoute} from '@react-navigation/native';
import {useRef, useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Linking, AppState} from 'react-native';
import Toast from 'react-native-toast-message';

import RouteNames from '../../../../constants/route-names.const';
import {checkout} from './services/payment.service';
import styles from './styles/style';
import {ICartList} from './../../../../common/interfaces/package.interface';
import {Colors} from '../../../../constants/color.const';

// Define the type for the route params
type SelectedItemsRouteParams = {
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
    cart: [
      // {
      // package: '',
      // name: '',
      // duration: 0,
      // noOfMember: 0,
      // quantity: 0,
      // },
    ],
  });
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
  }, []);

  const renderItem = () => {
    return itemsInfo.cart.map((item: any, index: any) => {
      return (
        <View key={index}>
          <Text>Tên gói:</Text>
          <Text>{item.name}</Text>
        </View>
      );
    });
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '90%',
          display: 'flex',
          gap: 10,
          backgroundColor: Colors.background,
          borderRadius: 10,
          marginVertical: 20,
        }}>
        {renderItem()}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          console.log('route.params:', selectedItemList);
          const response = await checkout(selectedItemList);
          console.log('Checkout response:', response);
          // const order = response.order;
          // const trans = response.trans;
          // console.log('order res:', order);
          // console.log('trans res:', trans);
          // const trans_id = response.trans._id;
          // console.log('trans_id', trans_id);
          //   // Open URL for payment
          //   Linking.openURL(response.order.order_url);
          //   const subscription = AppState.addEventListener(
          //     'change',
          //     nextAppState => {
          //       if (appState.current.match(/inactive|background/)) {
          //         console.log('Get user running in background');
          //       }
          //       if (
          //         appState.current.match(/inactive|background/) &&
          //         nextAppState === 'active'
          //       ) {
          //         console.log('App has come to the foreground!');
          //         // Check if trans_id exists in user's trxHist then user paid successfully
          //         const interValCheck = setInterval(async () => {
          //           const getRes = await getUserById();
          //           console.log('get user res:', getRes);
          //           console.log('trans id in hist:', getRes.user.trxHist);
          //           if (getRes.user.trxHist.includes(trans_id)) {
          //             console.log(trans_id, 'exists in trxHist');
          //             clearInterval(interValCheck);
          //           }
          //           Toast.show({
          //             type: 'success',
          //             text1: 'Thanh toán thành công',
          //             autoHide: true,
          //             visibilityTime: 1000,
          //             topOffset: 30,
          //             bottomOffset: 40,
          //             onHide: () => {
          //               navigation.navigate(RouteNames.PROFILE as never, {
          //                 activeTab: 'group',
          //               });
          //             },
          //           });
          //         }, 10 * 1000);
          //         setTimeout(() => {
          //           clearInterval(interValCheck);
          //         }, 2 * 60 * 1000);
          //       }
          //       appState.current = nextAppState;
          //       setAppStateVisible(appState.current);
          //       console.log('AppState', appState.current);
          //     },
          //   );
          //   return () => {
          //     subscription.remove();
          //   };
        }}>
        <Text style={styles.buttonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

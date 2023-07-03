import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RouteNames from '../../../../../constants/route-names.const';
import {Colors} from '../../../../../constants/color.const';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {getBillList} from './services/bill-list.service';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params?.groupId;

  const [billList, setBillList] = useState([]);
  const getBills = async () => {
    const bills = await getBillList(groupId);
    console.log('bills', JSON.stringify(bills, null, 2));
    if (
      !bills.group.billing ||
      !bills?.group?.billing.length ||
      bills?.group?.billing.length === 0
    ) {
      setBillList([]);
    } else {
      setBillList(bills.group.billing);
    }
  };
  useEffect(() => {
    console.log('groupId', groupId);
    getBills();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBills();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  const renderBillList = () => {
    return billList.map((bill: any, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            padding: 10,
            backgroundColor: Colors.background.white,
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate(RouteNames.BILL_INFO, {
              billId: bill._id,
            });
          }}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: Colors.text.grey,
              }}>
              Tên khoản chi tiêu:{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.lightgrey,
              }}>
              {bill.summary}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: Colors.text.grey,
              }}>
              Mô tả:{' '}
            </Text>
            <Text
              numberOfLines={3}
              style={{
                width: '100%',
                fontSize: 14,
                color: Colors.text.lightgrey,
              }}>
              {bill.description}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách phân chia chi tiêu</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.BILL, {
              groupId: groupId,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
        {renderBillList()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: width,
    minHeight: height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
});

export default BillListScreen;

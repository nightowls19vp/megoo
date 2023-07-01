import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {dateFormat} from '../../../../../common/handle.string';
import {getBillInfo} from './services/bill-info-service';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  billId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillInfoScreen = () => {
  const route = useRoute<GroupRouteProp>();
  const billId = route.params.billId;

  const [bill, setBill] = useState({});

  const getBill = async () => {
    const bill = await getBillInfo(billId);
    console.log('bill', JSON.stringify(bill, null, 2));
    setBill({
      _id: bill.billing._id ? bill.billing._id : '',
      summary: bill.billing.summary ? bill.billing.summary : '',
      description: bill.billing.description ? bill.billing.description : '',
      date: bill.billing.date ? dateFormat(bill.billing.date) : '',
      lender: bill.billing.lender ? bill.billing.lender : {},
      borrowers: bill.billing.borrowers ? bill.billing.borrowers : [],
    });
  };

  useEffect(() => {
    console.log('billId:', route.params.billId);
    getBill();
  }, []);

  return (
    <View>
      <Text>BillInfoScreen</Text>
    </View>
  );
};

export default BillInfoScreen;

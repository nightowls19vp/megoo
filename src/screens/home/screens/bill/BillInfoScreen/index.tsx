import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ProgressView} from '@react-native-community/progress-view';
import {RouteProp, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../../common/default';
import {dateFormat} from '../../../../../common/handle.string';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {deleteBill, getBillInfo} from './services/bill-info-service';
import styles from './styles/style';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  billId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillInfoScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const billId = route.params.billId;

  const [modalVisible, setModalVisible] = useState(false);

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const [openBorrowers, setOpenBorrowers] = useState(false);
  const [borrowerStatus, setBorrowerStatus] = useState(null);
  const [status, setStatus] = useState([
    {label: 'PENDING', value: 'PENDING'},
    {label: 'DONE', value: 'DONE'},
    {label: 'CANCELED', value: 'CANCELED'},
  ]);

  const [bill, setBill] = useState({
    _id: '',
    summary: '',
    description: '',
    date: '',
    lender: {
      _id: '',
      name: '',
      email: '',
      avatar: '',
    },
    borrowers: [
      {
        borrower: {
          _id: '',
          name: '',
          email: '',
          avatar: '',
        },
        amount: '',
        status: '',
      },
    ],
  });

  const getBill = async () => {
    const bill = await getBillInfo(billId);
    console.log('bill', JSON.stringify(bill, null, 2));
    setBill({
      _id: bill?.billing?._id ?? '',
      summary: bill?.billing?.summary ?? '',
      description: bill?.billing?.description ?? '',
      date: dateFormat(bill?.billing?.date) ?? '',
      lender: {
        _id: bill?.billing?.lender?._id ?? '',
        name: bill?.billing?.lender?.name ?? '',
        email: bill?.billing?.lender?.email ?? '',
        avatar: bill?.billing?.lender?.avatar ?? '',
      },

      borrowers: bill?.billing?.borrowers.map((borrower: any) => {
        return {
          borrower: {
            _id: borrower?.borrower?._id ?? '',
            name: borrower?.borrower?.name ?? '',
            email: borrower?.borrower?.email ?? '',
            avatar: borrower?.borrower?.avatar ?? '',
          },
          amount: borrower?.amount ?? '',
          status: borrower?.status ?? '',
        };
      }),
    });

    setSummary(bill?.billing?.summary ?? '');
    setDescription(bill?.billing?.description ?? '');
    setBorrowerStatus(bill?.billing?.borrowers[0]?.status ?? null);
  };

  useEffect(() => {
    console.log('billId:', route.params.billId);
    getBill();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <TextInput
          onChangeText={text => setSummary(text)}
          value={summary}
          style={[
            styles.textInput,
            {fontWeight: 'bold', fontSize: 20, color: Colors.text.grey},
          ]}
          placeholder={'Tên khoản chi tiêu'}
          placeholderTextColor={Colors.text.lightgrey}
        />
      </View>

      <View style={styles.contentContainer}>
        <TextInput
          onChangeText={text => setDescription(text)}
          value={description}
          style={[
            styles.textInput,
            {
              height: 70,
              display: 'flex',
              textAlignVertical: 'top',
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 10,
            },
          ]}
          multiline={true}
          placeholder={'Mô tả'}
          placeholderTextColor={Colors.text.lightgrey}
        />
      </View>

      <Text style={styles.title}>Người cho mượn</Text>
      <View style={styles.contentContainer}>
        <View style={styles.lenderContainer}>
          <Image
            source={{uri: bill?.lender?.avatar || IMAGE_URI_DEFAULT}}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.headingText}>Họ và tên:</Text>
              <Text style={styles.text}>{bill.lender.name}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Tiến độ</Text>
      <View style={styles.contentContainer}>
        <ProgressView
          progressTintColor="pink"
          trackTintColor="blue"
          progress={0.7}
          style={{width: '100%', alignSelf: 'center'}}
        />
      </View>

      <Text style={styles.title}>Danh sách người mượn</Text>
      <View style={styles.contentContainer}>
        {bill.borrowers.map((borrower, index) => (
          <View key={index} style={styles.borrowerContainer}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Image
                source={{uri: borrower?.borrower?.avatar || IMAGE_URI_DEFAULT}}
                style={styles.avatar}
              />
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.headingText}>Họ và tên:</Text>
                  <Text style={styles.text}>{borrower.borrower.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.headingText}>Số tiền:</Text>
                  <Text style={styles.text}>{borrower.amount} VND</Text>
                </View>
                <View style={[styles.infoRow, {alignItems: 'center'}]}>
                  <Text style={styles.headingText}>Trạng thái:</Text>
                  {borrower.borrower._id === bill.lender._id ? (
                    <DropDownPicker
                      containerStyle={{
                        width: '50%',
                      }}
                      dropDownContainerStyle={{
                        borderColor: Colors.border.lightgrey,
                      }}
                      style={{
                        borderColor: Colors.border.lightgrey,
                        minHeight: 30,
                      }}
                      selectedItemLabelStyle={{color: Colors.title.orange}}
                      zIndex={100000}
                      open={openBorrowers}
                      value={borrowerStatus}
                      items={status}
                      placeholder="Chọn người mượn"
                      placeholderStyle={{color: Colors.text.lightgrey}}
                      setOpen={setOpenBorrowers}
                      setValue={setBorrowerStatus}
                      setItems={setStatus}
                      onSelectItem={(item: any) => {
                        console.log('item', item);
                      }}
                    />
                  ) : (
                    <Text style={styles.text}>{borrower.status}</Text>
                  )}
                  {/* <Text style={styles.text}>{borrower.status}</Text> */}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log('billId', billId);
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>Xóa</Text>
      </TouchableOpacity>

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Xóa khoản chi tiêu này?</Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: Colors.text.orange}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setModalVisible(!modalVisible);
                const response = await deleteBill(billId);

                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Xóa khoản chỉ tiêu thành công',
                    autoHide: true,
                    visibilityTime: 1000,
                    topOffset: 30,
                    onHide: () => {
                      navigation.navigate(RouteNames.BILL_MANAGEMENT);
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: response.message,
                    autoHide: false,
                    topOffset: 30,
                  });
                }
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast position="top" />
    </ScrollView>
  );
};

export default BillInfoScreen;

import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

import RouteNames from '../../../../../constants/route-names.const';
import {Colors} from '../../../../../constants/color.const';
import {getUserGroup} from '../../../../../services/group.service';
import {createBill, getMembers} from './services/bill-service';
import {RouteProp, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  const [members, setMembers] = useState([
    {
      role: '',
      user: {
        _id: '',
        name: '',
        avatar: '',
        email: '',
        phone: '',
        dob: '',
      },
    },
  ]);

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  // State to open and close the dropdown picker
  const [openLender, setOpenLender] = useState(false);
  const [openBorrowers, setOpenBorrowers] = useState(false);

  const [lender, setLender] = useState(null);
  const [lenders, setLenders] = useState([{label: '', value: ''}]);

  const [borrower, setBorrower] = useState(null);
  const [borrowers, setBorrowers] = useState([{label: '', value: ''}]);

  const [selectedBorrower, setCurrentBorrower] = useState({
    _id: '',
    email: '',
    name: '',
    avatar: '',
  });
  const [amount, setAmount] = useState(0);
  const [selectedBorrowers, setSelectedBorrowers] = useState<any[]>([
    // {
    //   _id: '',
    //   email: '',
    //   name: '',
    //   avatar: '',
    //   amount: 0,
    // },
  ]);

  const getMemberList = async () => {
    try {
      console.log('groupId', groupId);

      const response = await getMembers(groupId);
      console.log('members', response.group.members);
      setMembers(response.group.members);

      setLenders(
        response.group.members.map((member: any) => {
          return {label: member.user.email, value: member.user.email};
        }),
      );

      setBorrowers(
        response.group.members.map((member: any) => {
          return {label: member.user.email, value: member.user.email};
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getMemberList();
  }, []);

  // If user changes the lender, remove the lender from the selected borrowers
  useEffect(() => {
    console.log('lender', lender);

    const index = selectedBorrowers.findIndex(
      (borrower: any) => borrower.email === lender,
    );

    if (index > -1) {
      setSelectedBorrowers(
        selectedBorrowers.filter((borrower: any) => borrower.email !== lender),
      );
      setAmount(0);
    }
  }, [lender]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          width: '90%',
          backgroundColor: Colors.background.white,
          borderRadius: 10,
          padding: 10,
          // paddingBottom: 20,
          marginTop: 20,
        }}>
        <Text style={styles.title}>Tên khoản chi tiêu</Text>
        <TextInput
          onChangeText={text => setSummary(text)}
          style={{
            width: '100%',
            textAlign: 'left',
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.border.lightgrey,
            padding: 10,
          }}
          placeholder={'Tên khoản chi tiêu'}
          placeholderTextColor={Colors.text.lightgrey}></TextInput>
      </View>
      <View
        style={{
          width: '90%',
          backgroundColor: Colors.background.white,
          borderRadius: 10,
          padding: 10,
          // paddingBottom: 20,
          marginTop: 20,
        }}>
        <Text style={styles.title}>Mô tả</Text>
        <TextInput
          onChangeText={text => setDescription(text)}
          style={{
            width: '100%',
            textAlign: 'left',
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.border.lightgrey,
            padding: 10,
          }}
          multiline={true}
          placeholder={'Mô tả'}
          placeholderTextColor={Colors.text.lightgrey}></TextInput>
      </View>

      <View style={styles.lenderContainer}>
        <Text style={[styles.title]}>Người cho mượn</Text>
        <DropDownPicker
          // containerStyle={{width: '90%'}}
          dropDownContainerStyle={{
            borderColor: Colors.border.lightgrey,
          }}
          style={{borderColor: Colors.border.lightgrey}}
          selectedItemLabelStyle={{color: Colors.title.orange}}
          open={openLender}
          value={lender}
          items={lenders}
          placeholder="Chọn người cho mượn"
          placeholderStyle={{color: Colors.text.lightgrey}}
          setOpen={setOpenLender}
          setValue={setLender}
          setItems={setLenders}
          onSelectItem={(item: any) => {
            setLender(item);

            // Remove lender from borrowers
            const index = borrowers.findIndex(
              (borrower: any) => borrower.label === item.label,
            );

            if (index > -1) {
              setBorrowers(
                members
                  .map((member: any) => {
                    return {
                      label: member.user.email,
                      value: member.user.email,
                    };
                  })
                  .filter((borrower: any) => borrower.label !== item.label),
              );
            }
          }}
        />
      </View>
      <View style={styles.borrowersContainer}>
        <Text style={[styles.title, {marginTop: 10}]}>Người mượn</Text>
        <View style={[styles.addBorrowerContainer, {zIndex: 99}]}>
          <DropDownPicker
            containerStyle={{width: '100%'}}
            dropDownContainerStyle={{borderColor: Colors.border.lightgrey}}
            style={{borderColor: Colors.border.lightgrey}}
            selectedItemLabelStyle={{color: Colors.title.orange}}
            zIndex={100000}
            open={openBorrowers}
            value={borrower}
            items={borrowers}
            placeholder="Chọn người mượn"
            placeholderStyle={{color: Colors.text.lightgrey}}
            setOpen={setOpenBorrowers}
            setValue={setBorrower}
            setItems={setBorrowers}
            onSelectItem={(item: any) => {
              console.log('item', item);

              //Find borrower in members
              const index = members.findIndex(
                (member: any) => member.user.email === item.label,
              );

              // Set selected item to selectedBorrower
              setCurrentBorrower({
                _id: members[index].user._id,
                email: members[index].user.email,
                name: members[index].user.name,
                avatar: members[index].user.avatar,
              });
            }}
          />
        </View>

        <View style={[styles.addBorrowerContainer, {zIndex: 0}]}>
          <View style={styles.amountContainer}>
            <TextInput
              onChangeText={value => setAmount(parseFloat(value))}
              style={{
                width: '70%',
                textAlign: 'left',
              }}
              placeholder={'Số tiền'}
              placeholderTextColor={Colors.text.lightgrey}
              keyboardType="numeric"
            />
            <Text>VND</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBorrowerButton}
          onPress={() => {
            console.log('selectedBorrower', selectedBorrower);
            console.log('amount', amount);

            // Check if borrower existed in selectedBorrowers
            const index = selectedBorrowers.findIndex(
              (borrower: any) => borrower._id === selectedBorrower._id,
            );
            console.log('index', index);

            // Add borrower to selectedBorrowers
            if (selectedBorrowers.length === 0) {
              setSelectedBorrowers([
                {
                  _id: selectedBorrower._id,
                  email: selectedBorrower.email,
                  name: selectedBorrower.name,
                  avatar: selectedBorrower.avatar,
                  amount: amount,
                  status: 'PENDING',
                },
              ]);
            } else {
              if (index < 0) {
                setSelectedBorrowers([
                  ...selectedBorrowers,
                  {
                    _id: selectedBorrower._id,
                    email: selectedBorrower.email,
                    name: selectedBorrower.name,
                    avatar: selectedBorrower.avatar,
                    amount: amount,
                    status: 'PENDING',
                  },
                ]);
                setBorrower(null);
                setAmount(0);
              }
            }
          }}>
          <Text style={styles.addBorrowerButtonText}>Thêm</Text>
        </TouchableOpacity>

        {selectedBorrowers ? (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              // backgroundColor: 'yellow',
            }}>
            {selectedBorrowers.map((borrower: any, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    height: Dimensions.get('window').height * 0.1,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // gap: 10,
                    marginBottom: 10,
                  }}>
                  <Image
                    source={{uri: borrower.avatar}}
                    style={{
                      width: Dimensions.get('window').height * 0.1,
                      height: Dimensions.get('window').height * 0.1,
                    }}
                  />
                  <View
                    style={{
                      width: '60%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      // backgroundColor: 'pink',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        // gap: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.text.grey,
                          marginRight: 10,
                        }}>
                        Người mượn:{' '}
                      </Text>
                      <Text>{borrower.name}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.text.grey,
                        }}>
                        Số tiền mượn:{' '}
                      </Text>
                      <Text>{borrower.amount} VND</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.text.grey,
                        }}>
                        Trạng thái:{' '}
                      </Text>
                      <Text>{borrower.status}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      onPress={() => {
                        // const borrowerIndex = borrowers.findIndex(
                        //   (borrower: any) => borrower === object,
                        // );
                      }}
                      name={'remove-circle'}
                      style={{
                        fontWeight: '200',
                        color: 'red',
                        fontSize: 24,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          false
        )}
      </View>

      <TouchableOpacity
        style={{
          width: '90%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.background.orange,
          borderRadius: 10,
          marginVertical: 20,
        }}
        onPress={async () => {
          console.log('summary', summary);
          console.log('desc', description);

          // Get lender in members array
          const selectedlender = members.find(
            (member: any) => member.user.email === lender,
          );

          const bill = {
            summary: summary,
            date: new Date(),
            lender: selectedlender?.user._id,
            borrowers: selectedBorrowers.map((borrower: any) => {
              return {
                borrower: borrower._id,
                amount: borrower.amount,
              };
            }),
            description: description,
          };

          console.log('bill', bill);

          const response = await createBill(groupId, bill);

          if (response.statusCode === 201) {
            Toast.show({
              type: 'success',
              text1: 'Đăng nhập thành công',
              autoHide: true,
              visibilityTime: 1000,
              topOffset: 30,
              bottomOffset: 40,
              onHide: () => {
                navigation.navigate(
                  RouteNames.BILL_MANAGEMENT as never,
                  {} as never,
                );
              },
            });
          } else {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          }

          console.log('Create bill response:', response);
        }}>
        <Text style={styles.buttonText}>Tạo</Text>
      </TouchableOpacity>
      <Toast position="top" />
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
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
  },
  lenderContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    gap: 10,
    zIndex: 999,
  },
  borrowersContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
    // backgroundColor: 'pink',
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  addBorrowerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // marginVertical: 5,
    zIndex: 999,
    // gap: 10,
  },
  amountContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
    paddingLeft: 5,
    paddingRight: 10,
  },
  addBorrowerButton: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    backgroundColor: Colors.buttonBackground.white,
    // marginVertical: 5,
  },
  addBorrowerButtonText: {
    color: Colors.text.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillScreen;

import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

import {Colors} from '../../../../../constants/color.const';
import {getUserGroup} from '../../../../../services/group.service';
import {getMembers} from './services/bill-service';
import {RouteProp, useRoute} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillScreen = () => {
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

  const [bill, setBill] = useState({
    summary: '',
    date: Date.now(),
    borrowers: [
      {
        user: '',
        amount: 0,
      },
    ],
    lender: '',
    description: '',
  });

  // State to open and close the dropdown picker
  const [openLender, setOpenLender] = useState(false);
  const [openBorrowers, setOpenBorrowers] = useState(false);

  const [lender, setLender] = useState(null);
  const [lenders, setLenders] = useState([{label: '', value: ''}]);

  const [borrower, setBorrower] = useState(null);
  const [borrowers, setBorrowers] = useState([{label: '', value: ''}]);

  const [currentBorrower, setCurrentBorrower] = useState({
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
      console.log('response', response);
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
    console.log('selectedBorrowers', selectedBorrowers);

    getMemberList();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.lenderContainer,
          // openLender && styles.expandedLenderContainer,
        ]}>
        <Text style={[styles.lenderText]}>Người cho mượn</Text>
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
                    return {label: member.user.email, value: member.user.email};
                  })
                  .filter((borrower: any) => borrower.label !== item.label),
              );
            }
          }}
        />
      </View>
      <View style={styles.borrowersContainer}>
        <Text style={styles.lenderText}>Người mượn</Text>
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

              console.log('index', index);
              console.log(members[index].user._id);

              // Set selected item to selectedBorrower
              setCurrentBorrower({
                _id: members[index].user._id,
                email: members[index].user.email,
                name: members[index].user.name,
                avatar: members[index].user.avatar,
              });
            }}
          />
          {/* <View style={styles.amountContainer}>
            <TextInput
              onChangeText={value => setAmount(parseFloat(value))}
              style={{
                width: '70%',
                textAlign: 'left',
              }}
              placeholder={'Số tiền'}
              placeholderTextColor={Colors.border.lightgrey}
              keyboardType="numeric"
            />
            <Text>VND</Text>
          </View> */}
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
              placeholderTextColor={Colors.border.lightgrey}
              keyboardType="numeric"
            />
            <Text>VND</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBorrowerButton}
          onPress={() => {
            console.log('selectedBorrower', selectedBorrowers);
            console.log('amount', amount);

            // Add borrower to selectedBorrowers
            if (selectedBorrowers.length === 0) {
              setSelectedBorrowers([
                {
                  _id: currentBorrower._id,
                  email: currentBorrower.email,
                  name: currentBorrower.name,
                  avatar: currentBorrower.avatar,
                  amount: amount,
                  status: 'PENDING',
                },
              ]);
            } else {
              setSelectedBorrowers([
                ...selectedBorrowers,
                {
                  _id: currentBorrower._id,
                  email: currentBorrower.email,
                  name: currentBorrower.name,
                  avatar: currentBorrower.avatar,
                  amount: amount,
                  status: 'PENDING',
                },
              ]);
            }
          }}>
          <Text style={styles.buttonText}>Thêm</Text>
        </TouchableOpacity>

        {selectedBorrowers ? (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              // backgroundColor: 'pink',
            }}>
            {selectedBorrowers.map((borrower: any, index) => {
              return (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginVertical: 10,
                  }}>
                  <Image
                    source={{uri: borrower.avatar}}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <Text>{borrower.name}</Text>
                  <Text>{borrower.amount}</Text>
                  <Text>{borrower.status}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
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
  lenderContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginTop: 20,
    gap: 10,
    zIndex: 999,
  },
  lenderText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  borrowersContainer: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    padding: 10,
    // marginVertical: 10,
    gap: 10,
  },
  addBorrowerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
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
    paddingHorizontal: 10,
  },
  addBorrowerButton: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.buttonBackground.orange,
    // marginVertical: 5,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillScreen;

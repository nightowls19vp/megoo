import {Formik} from 'formik';
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
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {createBill, getMembers} from './services/bill-service';
import styles from './styles/style';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tên khoản chi tiêu'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
  amount: Yup.string().required('Vui lòng nhập số tiền'),
  lender: Yup.string().required('Vui lòng chọn người cho mượn'),
  borrower: Yup.string().required('Vui lòng chọn người mượn'),
});

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
  const [selectedBorrowers, setSelectedBorrowers] = useState<any[]>([]);

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

  const renderError = (message: string) => {
    return (
      <View
        style={{
          marginTop: 5,
        }}>
        <Text
          style={{
            color: Colors.text.red,
            fontSize: 14,
          }}>
          {message}
        </Text>
      </View>
    );
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
    <Formik
      initialValues={{
        summary: '',
        description: '',
        lender: '',
        borrower: '',
        amount: '',
      }}
      validationSchema={BillSchema}
      onSubmit={async values => {
        console.log('summary:', values.summary);
        console.log('desc:', values.description);
        console.log('lender:', values.lender);

        // Get lender in members array
        const selectedlender = members.find(
          (member: any) => member.user.email === values.lender,
        );

        const bill = {
          summary: values.summary,
          date: new Date(),
          lender: selectedlender?.user._id,
          borrowers: selectedBorrowers.map((borrower: any) => {
            return {
              borrower: borrower._id,
              amount: borrower.amount,
            };
          }),
          description: values.description,
        };

        console.log('bill', bill);

        const response = await createBill(groupId, bill);
        console.log('Create bill response:', response);

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: 'Tạo khoản chi tiêu thành công',
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
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 20}]}>
            Tên khoản chi tiêu
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Tên khoản chi tiêu'}
              placeholderTextColor={Colors.text.lightgrey}
            />
            {values.summary && (
              <Ionicons
                onPress={() => setFieldValue('summary', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.summary && errors.summary && (
            <Text style={styles.error}>{errors.summary}</Text>
          )}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Tên khoản chi tiêu'}
              placeholderTextColor={Colors.text.lightgrey}
            />
            {values.description && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.description && errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <Text style={styles.title}>Người cho mượn</Text>
          <View style={styles.lenderContainer}>
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
                setFieldValue('lender', item.value);

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
            {/* {lenderError ? renderError('Vui lòng chọn người cho mượn') : null} */}
          </View>
          {touched.lender && errors.lender && (
            <Text style={styles.error}>{errors.lender}</Text>
          )}

          <Text style={[styles.title, {marginTop: 10}]}>Người mượn</Text>
          <View style={styles.borrowerContainer}>
            <View style={[styles.addBorrowerContainer]}>
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
                  setFieldValue('borrower', item.value);

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
            {touched.borrower && errors.borrower && (
              <Text style={styles.error}>{errors.borrower}</Text>
            )}

            <View style={[styles.addBorrowerContainer, {zIndex: 0}]}>
              <View style={styles.amountContainer}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('amount', value);
                    setAmount(parseFloat(value));
                  }}
                  onBlur={() => setFieldTouched('amount')}
                  // onChangeText={value => setAmount(parseFloat(value))}
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
            {touched.amount && errors.amount && (
              <Text style={styles.error}>{errors.amount}</Text>
            )}

            <TouchableOpacity
              style={styles.addBorrowerButton}
              onPress={() => {
                console.log('selectedBorrower', selectedBorrower);
                console.log('amount', values.amount);

                if (values.borrower !== '' || values.amount !== '') {
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
                        amount: values.amount,
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
                    <View key={index} style={styles.borrowersContainer}>
                      <Image
                        source={{uri: borrower.avatar}}
                        style={styles.borrowerAvatar}
                      />
                      <View style={styles.borrowerInfo}>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Người mượn: </Text>
                          <Text style={styles.text}>{borrower.name}</Text>
                        </View>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Số tiền mượn: </Text>
                          <Text style={styles.text}>{borrower.amount} VND</Text>
                        </View>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Trạng thái: </Text>
                          <Text style={styles.text}>{borrower.status}</Text>
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
                          style={styles.deleteIcon}
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
            style={[
              styles.createButton,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}
            disabled={!isValid}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Tạo</Text>
          </TouchableOpacity>
          <Toast position="top" />
        </ScrollView>
      )}
    </Formik>
  );
};

export default BillScreen;

import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';

import RouteNames from '../../../../../constants/route-names.const';
import {Colors} from '../../../../../constants/color.const';
import moment from 'moment';
import {getMembers} from '../../../../../services/group.service';
import {createTask} from './services/task.service';
import Toast from 'react-native-toast-message';

type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const CreateTaskSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề sự kiện'),
  startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
});

const CreateTaskScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(date);
  const [open, setOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: 'Không lặp lại',
      value: 'Does not repeat',
    },
    {
      label: 'Hàng ngày',
      value: 'Daily',
    },
    {
      label: 'Tùy chỉnh',
      value: 'Custom',
    },
  ]);
  const [value, setValue] = useState(items[0].value);

  const [members, setMembers] = useState<
    {
      role: string;
      user: {
        _id: string;
        name: string;
        avatar: string;
        email: string;
      };
    }[]
  >([]);

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    members.map(() => false),
  );
  const [state, setState] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);
  };

  const getMembersInGroup = async () => {
    const response = await getMembers(groupId);
    console.log(
      'Members response:',
      JSON.stringify(response.group.members, null, 2),
    );

    setMembers(
      response.group.members.map((member: any) => {
        return {
          role: member.role,
          user: {
            _id: member.user._id,
            name: member.user.name,
            avatar: member.user.avatar,
            email: member.user.email,
          },
        };
      }),
    );
  };

  useEffect(() => {
    console.log('groupId', groupId);
    getMembersInGroup();
  }, []);

  useEffect(() => {
    const newSelectedMembers = toggleCheckBoxArray
      .map((item, index) =>
        toggleCheckBoxArray[index] ? members[index].user._id : null,
      )
      .filter(Boolean) as string[];

    setSelectedMembers(newSelectedMembers);
  }, [toggleCheckBoxArray]);

  useEffect(() => {
    console.log('selectedMembers', selectedMembers);
  }, [selectedMembers]);

  return (
    <Formik
      initialValues={{
        summary: '',
        description: '',
        startDate: '',
        endDate: '',
      }}
      enableReinitialize={true}
      validationSchema={CreateTaskSchema}
      onSubmit={async values => {
        console.log('values', values);

        const isRepeated = value === 'Does not repeat' ? false : true;

        const task = {
          summary: values.summary,
          description: values.description,
          startDate: moment(
            values.startDate,
            'DD/MM/YYYY hh:mm A',
          ).toISOString(),
          isRepeated: isRepeated,
          state: state === true ? 'Public' : 'Private',
          members: state === true ? selectedMembers : undefined,
        };

        console.log('task', JSON.stringify(task, null, 2));

        const response = await createTask(groupId, task);

        console.log('response', JSON.stringify(response, null, 2));

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: 'Tạo sự kiện thành công',
            autoHide: true,
            visibilityTime: 1000,
            topOffset: 30,
            onHide: () => {
              navigation.navigate(RouteNames.TASK_LIST, {});
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: response.message,
            autoHide: false,
            topOffset: 20,
          });
        }
      }}>
      {({
        setFieldValue,
        setFieldTouched,
        handleSubmit,
        isValid,
        values,
        errors,
        touched,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 15}]}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tiêu đề sự kiện'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.summary}
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
          <Text style={styles.title}>Thời gian</Text>
          <View style={[styles.inputContainer]}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('dob', value)}
              onBlur={() => setFieldTouched('startDate')}
              placeholder={'Chọn thời gian sự kiện'}
              style={styles.inputText}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.startDate}
            />

            <DatePicker
              modal
              open={open}
              date={selectedDate}
              mode={'datetime'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onDateChange={value => {
                console.log('Date change value:', value);

                setSelectedDate(value);
                setFieldValue('startDate', value);
              }}
              onConfirm={value => {
                console.log('Selected date:', value);

                setOpen(false);
                setDate(value);
                setFieldValue(
                  'startDate',
                  moment(value)
                    .format('DD/MM/YYYY LT')
                    .replace('PM', 'CH')
                    .replace('AM', 'SA'),
                );

                console.log('startDate', values.startDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            {values.startDate && (
              <Ionicons
                onPress={() => setFieldValue('startDate', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Ionicons
              onPress={() => {
                setOpen(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>
          {touched.startDate && errors.startDate && (
            <Text style={styles.error}>{errors.startDate}</Text>
          )}
          <DropDownPicker
            containerStyle={{
              width: '90%',
              zIndex: 1000,
              padding: 0,
              marginBottom: 5,
              backgroundColor: 'pink',
            }}
            dropDownContainerStyle={{
              borderColor: Colors.border.lightgrey,
              borderRadius: 0,
            }}
            // style={{borderColor: Colors.border.lightgrey, borderRadius: 10}}
            style={{
              borderWidth: 0,
              borderBottomWidth: 1,
              borderRadius: 0,
              paddingLeft: 0,
              paddingRight: 0,
              minHeight: 50,
              borderColor: Colors.border.lightgrey,
            }}
            iconContainerStyle={{
              paddingRight: 0,
              display: 'none',
            }}
            // selectedItemLabelStyle={{color: Colors.title.orange}}
            open={openDropdown}
            value={value}
            items={items}
            setOpen={setOpenDropdown}
            setValue={setValue}
            setItems={setItems}
            placeholder={items[0].label}
            // placeholderStyle={{color: Colors.text.lightgrey}}
          />
          <Text style={styles.title}>Chế độ</Text>
          <View
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              marginTop: 5,
              alignItems: 'center',
              // justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => setState(!state)}>
              <FontAwesomeIcon
                name={state ? 'toggle-on' : 'toggle-off'}
                style={[styles.inputIcon, {color: Colors.icon.orange}]}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                color: Colors.text.grey,
              }}>
              Nhóm
            </Text>
          </View>
          {state === true && (
            <View
              style={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                marginTop: 5,
              }}>
              {members.map((member, index) => (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: -5,
                    gap: 7,
                  }}>
                  <CheckBox
                    key={index}
                    tintColors={{true: Colors.checkBox.orange}}
                    value={toggleCheckBoxArray[index]}
                    onValueChange={newValue =>
                      handleToggleCheckBox(index, newValue)
                    }
                  />
                  <Text>{member.user.name}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập mô tả sự kiện'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.description}
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

          <TouchableOpacity
            disabled={!isValid}
            onPress={handleSubmit}
            style={[
              styles.createButton,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}>
            <Text
              style={{
                color: Colors.text.white,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Tạo
            </Text>
          </TouchableOpacity>

          <Toast position="top" />
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    marginTop: 10,
  },
  inputContainer: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey, paddingLeft: 0},
  error: {
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  radioButtonContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  createButton: {
    width: '90%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default CreateTaskScreen;

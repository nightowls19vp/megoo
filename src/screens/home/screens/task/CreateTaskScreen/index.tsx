import {Formik} from 'formik';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';
import {ButtonGroup} from 'react-native-elements/dist/buttons/ButtonGroup';

import CheckBox from '@react-native-community/checkbox';
import {RouteProp, useRoute} from '@react-navigation/native';

import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getMembers} from '../../../../../services/group.service';
import {createTask} from './services/task.service';

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
      label: 'Hằng ngày',
      value: 'Daily',
    },
    {
      label: 'Tùy chỉnh',
      value: 'Custom',
    },
  ]);
  const [units, setUnits] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: 'ngày',
      value: 'day',
    },
    {
      label: 'tuần',
      value: 'week',
    },
    {
      label: 'tháng',
      value: 'month',
    },
    {
      label: 'năm',
      value: 'year',
    },
  ]);
  const [recurrenceValue, setRecurenceValue] = useState(items[0].value);
  const [isRecurrenceFocus, setIsRecurrenceFocus] = useState(false);

  const [unitValue, setUnitValue] = useState(units[1].value);
  const [isUnitFocus, setIsUnitFocus] = useState(false);

  const [times, setTimes] = useState('');
  const [repeatOn, setRepeatOn] = useState<string[]>([]);

  const buttons: string[] = ['2', '3', '4', '5', '6', '7', 'CN'];
  const [selectedButtons, setSelectedButtons] = useState<number[]>([]);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Không bao giờ',
        value: 'never',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
      {
        id: '2',
        label: 'Vào ngày',
        value: 'on',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(
    radioButtons[0].id,
  );
  const [selectedOption, setSelectedOption] = useState<string | undefined>();

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

  const convertDateToString = (date: string): string => {
    let result = '';
    switch (date) {
      case '2':
        result = 'Mon';
        break;
      case '3':
        result = 'Tue';
        break;
      case '4':
        result = 'Wen';
        break;
      case '5':
        result = 'Thu';
        break;
      case '6':
        result = 'Fri';
        break;
      case '7':
        result = 'Sat';
        break;
      case 'CN':
        result = 'Sun';
        break;
      default:
        result = '';
        break;
    }
    return result;
  };

  useEffect(() => {
    let selectedDay: string[] = [];
    selectedButtons.map(item => {
      console.log('item', item);
      console.log('buttons[index]:', buttons[item]);
      const dateString = convertDateToString(buttons[item]);
      if (selectedDay.indexOf(dateString) === -1) {
        selectedDay.push(dateString);
      }
    });
    setRepeatOn(selectedDay);
  }, [selectedButtons]);

  useEffect(() => {
    console.log('repeatOn', repeatOn);
  }, [repeatOn]);

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

        const isRepeated = recurrenceValue === 'Does not repeat' ? false : true;

        const task = {
          summary: values.summary,
          description: values.description,
          startDate: moment(
            values.startDate,
            'DD/MM/YYYY hh:mm A',
          ).toISOString(),
          isRepeated: isRepeated,
          recurrence: isRepeated
            ? {
                times: times,
                unit: unitValue,
                repeatOn: repeatOn,
                ends: moment(
                  values.startDate,
                  'DD/MM/YYYY hh:mm A',
                ).toISOString(),
              }
            : undefined,
          members: state === true ? selectedMembers : undefined,
          state: state === true ? 'Public' : 'Private',
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
            onHide: () => {
              navigation.goBack();
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Tạo sự kiện thất bại',
            autoHide: true,
            visibilityTime: 1000,
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

          <Text style={styles.title}>Thời gian bắt đầu</Text>
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

          <Dropdown
            style={{
              width: '90%',
              height: 50,
              borderBottomWidth: 1,
              borderColor: Colors.border.lightgrey,
            }}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isRecurrenceFocus ? 'Lặp lại' : '...'}
            placeholderStyle={{
              fontSize: 14,
              color: Colors.text.lightgrey,
            }}
            selectedTextStyle={{
              color: Colors.text.grey,
              fontSize: 14,
            }}
            itemTextStyle={{
              color: Colors.text.grey,
              fontSize: 14,
            }}
            value={recurrenceValue}
            onFocus={() => setIsRecurrenceFocus(true)}
            onBlur={() => setIsRecurrenceFocus(false)}
            onChange={item => {
              setRecurenceValue(item.value);
              setIsRecurrenceFocus(false);
            }}
          />
          {recurrenceValue === 'Custom' && (
            <View
              style={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',

                  gap: 10,
                }}>
                <Text>Lặp lại mỗi:</Text>
                <TextInput
                  style={{
                    width: '10%',
                    paddingLeft: 5,
                    paddingVertical: 0,
                    borderBottomWidth: 1,
                    borderColor: Colors.border.lightgrey,
                    color: Colors.text.grey,
                  }}
                  textAlign={'center'}
                  keyboardType="numeric"
                  value={times}
                  onChangeText={text => setTimes(text)}
                />
                <Dropdown
                  style={{
                    width: '30%',
                    height: 50,
                  }}
                  data={units}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isUnitFocus ? 'Chọn đơn vị' : '...'}
                  placeholderStyle={{
                    color: Colors.text.lightgrey,
                  }}
                  itemTextStyle={{
                    color: Colors.text.grey,
                    fontSize: 14,
                  }}
                  value={unitValue}
                  onFocus={() => setIsUnitFocus(true)}
                  onBlur={() => setIsUnitFocus(false)}
                  onChange={item => {
                    setUnitValue(item.value);

                    setIsUnitFocus(false);
                  }}
                />
              </View>

              {unitValue !== 'day' && (
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: 10,
                  }}>
                  <Text>Lặp lại vào thứ:</Text>
                  <ButtonGroup
                    onPress={item => {
                      console.log('item:', item);

                      setSelectedButtons(item);
                    }}
                    selectMultiple={true}
                    selectedIndexes={selectedButtons}
                    buttons={buttons}
                    containerStyle={{
                      width: '100%',
                      height: 30,
                      borderWidth: 0,
                      marginLeft: 0,
                      // backgroundColor: 'pink',
                    }}
                    innerBorderStyle={{
                      width: 0,
                    }}
                    selectedButtonStyle={{
                      backgroundColor: Colors.icon.orange,
                      borderRadius: 50,
                    }}
                    buttonContainerStyle={{
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                    buttonStyle={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: Colors.border.orange,
                      backgroundColor: Colors.background.white,
                    }}
                    textStyle={{
                      color: Colors.text.orange,
                    }}
                  />
                </View>
              )}

              <View
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 10,
                }}>
                <Text>Kết thúc:</Text>
                <RadioGroup
                  containerStyle={styles.radioButtonContainer}
                  layout="column"
                  radioButtons={radioButtons}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                />
              </View>
            </View>
          )}

          <Text style={[styles.title, {marginTop: 15}]}>Chế độ</Text>
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
    height: 50,
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
  },
  createButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default CreateTaskScreen;

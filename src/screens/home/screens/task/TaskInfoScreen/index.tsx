import {Formik} from 'formik';
import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {Colors} from '../../../../../constants/color.const';
import {getTaskById} from './services/task.service';
import {Dropdown} from 'react-native-element-dropdown';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {ButtonGroup} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {
  convertDayNumberToDayText,
  convertDayTextToDayNumber,
  dateFormat,
  dateFormatWithTime,
  dateISOFormat,
} from './../../../../../common/handle.string';

type TaskRouteParams = {
  taskId: string;
};

// Specify the type for the route
type TaskRouteProp = RouteProp<Record<string, TaskRouteParams>, string>;

const TaskSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
});

const TaskDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<TaskRouteProp>();
  const taskId = route.params.taskId;
  const [task, setTask] = useState<{
    _id: string;
    summary: string;
    description: string;
    isRepeated: boolean;
    recurrence?: {
      times: number;
      unit: string;
      repeatOn: string[];
      ends: string;
    };
    startDate: string;
    state: string;
    members?: {
      _id: string;
      name: string;
      avatar: string;
      email: string;
    }[];
    createdBy: {
      _id: string;
      name: string;
      avatar: string;
      email: string;
    };
  }>({
    _id: '',
    summary: '',
    description: '',
    isRepeated: false,
    recurrence: undefined,
    startDate: '',
    state: '',
    members: undefined,
    createdBy: {
      _id: '',
      name: '',
      avatar: '',
      email: '',
    },
  });
  const [state, setState] = useState(false);
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
    // {
    //   label: 'Hằng ngày',
    //   value: 'Daily',
    // },
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
      value: 'Day',
    },
    {
      label: 'tuần',
      value: 'Week',
    },
    {
      label: 'tháng',
      value: 'Month',
    },
    {
      label: 'năm',
      value: 'Year',
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

  const [endDate, setEndDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [openEndDate, setOpenEndDate] = useState(false);

  const getTaskDetail = async () => {
    const response = await getTaskById(taskId);
    console.log('Get task response', response.task);

    setTask({
      _id: response?.task._id,
      summary: response?.task.summary,
      description: response?.task.description,
      isRepeated: response?.task.isRepeated,
      recurrence: {
        times: response?.task.recurrence?.times,
        unit: response?.task.recurrence?.unit,
        repeatOn: response?.task.recurrence?.repeatOn,
        ends: dateFormatWithTime(response?.task.recurrence?.ends as string),
      },
      startDate: dateFormatWithTime(response?.task.startDate as string),
      state: response?.task.state,
      members: response.task?.members?.map((member: any) => ({
        _id: member._id,
        name: member.name,
        avatar: member.avatar,
        email: member.email,
      })),
      createdBy: {
        _id: response?.task.createdBy._id,
        name: response?.task.createdBy.name,
        avatar: response?.task.createdBy.avatar,
        email: response?.task.createdBy.email,
      },
    });
    setState(response?.task.state);
    setRecurenceValue(
      response?.task.isRepeated ? items[1].value : items[0].value,
    );
    setTimes(`${response?.task.recurrence?.times}` ?? '');
    if (response?.task.recurrence?.unit === 'Day') {
      setUnitValue(units[0].value);
    } else if (response?.task.recurrence?.unit === 'Week') {
      setUnitValue(units[1].value);
    } else if (response?.task.recurrence?.unit === 'Month') {
      setUnitValue(units[2].value);
    } else if (response?.task.recurrence?.unit === 'Year') {
      setUnitValue(units[3].value);
    }
    setRepeatOn(
      response?.task.recurrence?.repeatOn.map((item: any) =>
        convertDayTextToDayNumber(item),
      ),
    );

    if (response?.task.recurrence?.repeatOn.length > 0) {
      let buttonList: number[] = [];
      response?.task.recurrence?.repeatOn.map((day: any) => {
        // console.log('day', day);

        const index = buttons.findIndex(
          item => item === convertDayTextToDayNumber(day),
        );
        // Add index to selectedButtons of index !== -1
        if (index !== -1) {
          buttonList.push(index);
        }
      });
      // console.log('buttonList:', buttonList);

      setSelectedButtons(buttonList);
    }

    if (response?.task.recurrence?.ends) {
      setSelectedId(radioButtons[1].id);
      // setEndDate(new Date(response?.task.recurrence?.ends));
      console.log('ends', response?.task.recurrence?.ends);
    }
  };

  useEffect(() => {
    console.log('taskId', taskId);
    getTaskDetail();
  }, []);

  useEffect(() => {
    console.log('task', task);
  }, [task]);

  useEffect(() => {
    let selectedDay: string[] = [];
    selectedButtons.map(item => {
      // console.log('item', item);
      // console.log('buttons[index]:', buttons[item]);
      const dateString = convertDayNumberToDayText(buttons[item]);
      if (selectedDay.indexOf(dateString) === -1) {
        selectedDay.push(dateString);
      }
    });
    setRepeatOn(selectedDay);
  }, [selectedButtons]);

  // useEffect(() => {
  //   console.log('repeatOn', repeatOn);
  // }, [repeatOn]);

  return (
    <Formik
      initialValues={{
        summary: task.summary,
        description: task.description,
        endDate: task.recurrence?.ends ?? '',
      }}
      validationSchema={TaskSchema}
      enableReinitialize={true}
      onSubmit={values => {}}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
        handleChange,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onEndEditing={async () => {
                console.log('values.summary:', values.summary);
              }}
              onBlur={() => setFieldTouched('summary')}
              style={styles.inputText}
              placeholder={'Nhập tóm tắt việc cần làm'}
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

          <Text style={styles.title}>Mô tả/Ghi chú</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onEndEditing={async () => {
                console.log('values.description:', values.description);
              }}
              onBlur={() => setFieldTouched('description')}
              style={styles.inputText}
              placeholder={'Nhập tóm tắt việc cần làm'}
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

              {unitValue !== 'Day' && (
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
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 10,
                  // backgroundColor: 'yellow',
                }}>
                <Text>Kết thúc:</Text>
                <RadioGroup
                  containerStyle={styles.radioButtonContainer}
                  layout="column"
                  radioButtons={radioButtons}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                />
                {selectedId === '2' && (
                  <>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          width: '89%',
                          alignSelf: 'flex-end',
                          // backgroundColor: 'pink',
                        },
                      ]}>
                      <TextInput
                        editable={false}
                        // onChangeText={value => setFieldValue('dob', value)}
                        onBlur={() => setFieldTouched('endDate')}
                        placeholder={'Chọn thời gian kết thúc nhắc nhở'}
                        style={styles.inputText}
                        placeholderTextColor={Colors.text.lightgrey}
                        value={values.endDate}
                      />

                      <DatePicker
                        modal
                        open={openEndDate}
                        date={selectedEndDate}
                        mode={'datetime'}
                        locale={'vi'}
                        title={'Chọn ngày'}
                        confirmText={'Chọn'}
                        cancelText={'Huỷ'}
                        onDateChange={value => {
                          console.log('Date change value:', value);

                          setSelectedEndDate(value);
                          setFieldValue('endDate', value);
                        }}
                        onConfirm={value => {
                          console.log('Selected date:', value);

                          setOpenEndDate(false);
                          setEndDate(value);
                          setFieldValue(
                            'endDate',
                            moment(value)
                              .format('DD/MM/YYYY LT')
                              .replace('PM', 'CH')
                              .replace('AM', 'SA'),
                          );

                          console.log('endDate', values.endDate);
                        }}
                        onCancel={() => {
                          setOpenEndDate(false);
                        }}
                      />

                      {values.endDate && (
                        <Ionicons
                          onPress={() => setFieldValue('endDate', '')}
                          name={'close'}
                          style={[styles.inputIcon, {marginRight: 5}]}
                        />
                      )}
                      <Ionicons
                        onPress={() => {
                          setOpenEndDate(true);
                        }}
                        name={'calendar'}
                        style={styles.inputIcon}
                      />
                    </View>
                    {touched.endDate && errors.endDate && (
                      <Text style={styles.error}>{errors.endDate}</Text>
                    )}
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
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
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  removeIcon: {
    fontWeight: '200',
    color: Colors.icon.red,
    fontSize: 24,
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

export default TaskDetailScreen;

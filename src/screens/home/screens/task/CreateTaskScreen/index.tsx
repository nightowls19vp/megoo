import {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';

import {Colors} from '../../../../../constants/color.const';
import moment from 'moment';

type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const CreateTaskScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(date);
  const [open, setOpen] = useState(false);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Cá nhân',
        value: 'Private',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
      {
        id: '2',
        label: 'Nhóm',
        value: 'Public',
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

  const [openDropdown, setOpenDropdown] = useState(false);
  const [value, setValue] = useState(null);
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

  useEffect(() => {
    console.log('groupId', groupId);
  }, []);

  useEffect(() => {
    // get value from radio button when selectedId changed
    console.log('selectedId', selectedId);
    console.log('radioButtons', radioButtons);

    const selectedRadioButton = radioButtons.find(e => e.id === selectedId);
    console.log('selectedRadioButton', selectedRadioButton);
    setSelectedOption(selectedRadioButton?.value);
  }, [selectedId]);

  return (
    <Formik
      initialValues={{
        summary: '',
        description: '',
        startDate: '',
        endDate: '',
      }}
      enableReinitialize={true}
      onSubmit={values => {
        console.log('values', values);
      }}>
      {({
        setFieldValue,
        setFieldTouched,
        setFieldError,
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
              // editable={false}
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
            }}
            selectedItemLabelStyle={{color: Colors.title.orange}}
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
          <RadioGroup
            containerStyle={styles.radioButtonContainer}
            layout="column"
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
          />

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
    fontSize: 14,
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
});

export default CreateTaskScreen;

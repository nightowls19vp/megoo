import {Dimensions, StyleSheet, Text, View, TextInput} from 'react-native';
import {Colors} from '../../../../../constants/color.const';
import Slider from '@react-native-community/slider';
import {useState, useEffect} from 'react';
import {splitString} from '../../../../../common/handle.string';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {dateFormat} from './../../../../../common/handle.string';
import moment from 'moment';
import styles from './styles/style';

const InterestRateScreen = () => {
  const [sliderAmount, setSliderAmount] = useState(50000000);
  const [amount, setAmount] = useState<string>(sliderAmount.toString());
  const [rate, setRate] = useState('');
  const [interest, setInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState(dateFormat(date.toISOString()));
  const [selectedDate, setSelectedDate] = useState(date);
  const [maturityDateString, setMaturityDateString] = useState(
    dateFormat(date.toISOString()),
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: '1 tháng',
      value: '1',
    },
    {
      label: '2 tháng',
      value: '2',
    },
    {
      label: '3 tháng',
      value: '3',
    },
    {
      label: '4 tháng',
      value: '4',
    },
    {
      label: '5 tháng',
      value: '5',
    },
    {
      label: '6 tháng',
      value: '6',
    },
    {
      label: '7 tháng',
      value: '7',
    },
    {
      label: '8 tháng',
      value: '8',
    },
    {
      label: '9 tháng',
      value: '9',
    },
    {
      label: '10 tháng',
      value: '10',
    },
    {
      label: '11 tháng',
      value: '11',
    },
    {
      label: '12 tháng',
      value: '12',
    },
    {
      label: '15 tháng',
      value: '15',
    },
    {
      label: '18 tháng',
      value: '18',
    },
    {
      label: '24 tháng',
      value: '24',
    },
    {
      label: '36 tháng',
      value: '36',
    },
  ]);
  const [period, setPeriod] = useState(items[0].value);

  const handleRateChange = (value: string) => {
    // Remove non-digit characters from the input value
    const numericValue = value.replace(/[^\d.]/g, '');

    // Validate the input to allow only decimal with 2 digits after the comma
    const decimalRegex = /^\d+(\.\d{0,2})?$/;
    if (decimalRegex.test(numericValue) || numericValue === '') {
      setRate(numericValue);
    }
  };

  useEffect(() => {
    setAmount(sliderAmount.toString());
  }, [sliderAmount]);

  useEffect(() => {
    const amountInt = parseInt(amount);
    if (amountInt >= 50000000) {
      setSliderAmount(amountInt);
    }
  }, [amount]);

  useEffect(() => {
    // Check if both send date and period are valid
    if (dateString && period) {
      // Parse the send date using moment
      const parsedSendDate = moment(dateString, 'D/M/YYYY');

      // Calculate the maturity date by adding the period to the send date
      const calculatedMaturityDate = parsedSendDate.add(
        parseInt(period),
        'months',
      );

      // Format the calculated maturity date as "D/M/YYYY" and set it to state
      // Format the calculated maturity date as "D/M/YYYY" and convert it to string
      const formattedMaturityDate = calculatedMaturityDate.format('DD/MM/YYYY');

      // Set the formatted maturity date to the state
      setMaturityDateString(formattedMaturityDate);
    }
  }, [dateString, period]);

  useEffect(() => {
    if (amount && rate && period) {
      console.log('amount', amount);
      console.log('rate', rate);
      console.log('period', period);

      const interestAmount =
        ((parseInt(amount) * parseFloat(rate)) / 100 / 12) * parseInt(period);
      console.log('interestAmount', interestAmount);

      setInterest(Math.round(interestAmount));
    } else {
      setInterest(0);
    }
  }, [amount, rate, period]);

  useEffect(() => {
    if (amount && interest) {
      setTotalAmount(parseInt(amount) + interest);
    } else {
      setTotalAmount(0);
    }
  }, [interest]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Số tiền gửi</Text>
        <Text>VND</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          {borderBottomWidth: 0, marginBottom: -5},
        ]}>
        <TextInput
          keyboardType="number-pad"
          style={styles.inputText}
          value={splitString(amount)}
          onChangeText={value => {
            const numericValue = value.replace(/\D/g, '');
            setAmount(numericValue);
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: 'pink',
          paddingHorizontal: 3,
        }}>
        <Slider
          style={{
            width: '100%',
            height: 30,
          }}
          step={500000}
          value={sliderAmount}
          minimumValue={5000000}
          maximumValue={3000000000}
          lowerLimit={1000000}
          thumbTintColor={Colors.text.orange}
          minimumTrackTintColor={Colors.text.orange}
          maximumTrackTintColor={Colors.text.lightgrey}
          onValueChange={value => {
            setSliderAmount(value);
          }}
        />
      </View>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>50 triệu</Text>
        <Text>3 tỷ</Text>
      </View>

      <Text style={styles.title}>Kỳ hạn</Text>
      <DropDownPicker
        listMode="MODAL"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        containerStyle={{
          width: '90%',
          zIndex: 1000,
          padding: 0,
          marginBottom: 5,
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
          minHeight: 40,
          borderColor: Colors.border.lightgrey,
        }}
        iconContainerStyle={{
          paddingRight: 0,
          display: 'none',
        }}
        // selectedItemLabelStyle={{color: Colors.title.orange}}
        open={openDropdown}
        value={period}
        items={items}
        setOpen={setOpenDropdown}
        setValue={setPeriod}
        setItems={setItems}
        placeholder={items[0].label}
      />

      <Text style={styles.title}>Lãi suất</Text>
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="number-pad"
          style={styles.inputText}
          value={rate}
          maxLength={5}
          placeholder={'Nhập lãi suất'}
          placeholderTextColor={Colors.text.lightgrey}
          onChangeText={handleRateChange}
        />
        <Text>
          {'%'} {'/'} năm
        </Text>
      </View>

      <Text style={styles.title}>Ngày gửi</Text>
      <View style={styles.inputContainer}>
        <TextInput
          editable={false}
          style={styles.inputText}
          value={dateString}
          placeholder={'Chọn ngày gửi'}
          placeholderTextColor={Colors.text.lightgrey}
        />

        <DatePicker
          modal
          open={openDatePicker}
          date={selectedDate}
          mode={'date'}
          locale={'vi'}
          title={'Chọn ngày'}
          confirmText={'Chọn'}
          cancelText={'Huỷ'}
          onDateChange={value => {
            setSelectedDate(value);
          }}
          onConfirm={value => {
            console.log('Selected date:', value);
            setSelectedDate(value);
            setOpenDatePicker(false);
            setDateString(dateFormat(value.toString()));
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />
        <View
          style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
          {date && (
            <Ionicons
              onPress={() => setDateString('')}
              name={'close'}
              style={[styles.inputIcon, {marginRight: 5}]}
            />
          )}
          <Ionicons
            onPress={() => {
              setOpenDatePicker(true);
            }}
            name={'calendar'}
            style={styles.inputIcon}
          />
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, {width: '50%'}]}>Ngày đáo hạn</Text>
        <Text style={{color: Colors.text.lightgrey}}>{maturityDateString}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, {width: '50%'}]}>Số tiền lãi</Text>
        <Text style={styles.amountText}>
          {splitString(interest.toString())} VND
        </Text>
      </View>

      <View style={[styles.titleContainer, {flexDirection: 'column'}]}>
        <Text style={[styles.title]}>Số tiền khi đến hạn</Text>
        <Text style={styles.amountText}>
          {splitString(totalAmount.toString())} VND
        </Text>
      </View>
    </View>
  );
};

export default InterestRateScreen;

import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import {Colors} from '../../../../../constants/color.const';
import Slider from '@react-native-community/slider';
import {useState, useEffect} from 'react';
import {splitString} from '../../../../../common/handle.string';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {dateFormat} from './../../../../../common/handle.string';
import moment from 'moment';
import styles from './styles/style';

const InterestRateScreen = () => {
  const [sliderAmount, setSliderAmount] = useState(50000000);
  const [amount, setAmount] = useState<string>(sliderAmount.toString());
  const [date, setDate] = useState(new Date());

  const [oldInterest, setOldInterest] = useState<{
    rate: string;
    date: string;
    maturityDate: string;
    period: string;
    interest: number;
    totalAmount: number;
    openPicker: boolean;
  }>({
    rate: '',
    date: dateFormat(date.toISOString()),
    maturityDate: '',
    period: '',
    interest: 0,
    totalAmount: 0,
    openPicker: false,
  });

  const [newInterest, setNewInterest] = useState<{
    rate: string;
    date: string;
    maturityDate: string;
    period: string;
    interest: number;
    totalAmount: number;
    openPicker: boolean;
  }>({
    rate: '',
    date: dateFormat(date.toISOString()),
    maturityDate: '',
    period: '',
    interest: 0,
    totalAmount: 0,
    openPicker: false,
  });

  const [selectedDate, setSelectedDate] = useState(date);

  const [isFocus, setIsFocus] = useState(false);
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

  const handleRateChange = (value: string, type: string) => {
    // Remove non-digit characters from the input value
    const numericValue = value.replace(/[^\d.]/g, '');

    // Validate the input to allow only decimal with 2 digits after the comma
    const decimalRegex = /^\d+(\.\d{0,2})?$/;
    if (decimalRegex.test(numericValue) || numericValue === '') {
      if (type === 'old') {
        setOldInterest(oldInterest => {
          return {
            ...oldInterest,
            rate: numericValue,
          };
        });
      } else {
        setNewInterest(newInterest => {
          return {
            ...newInterest,
            rate: numericValue,
          };
        });
      }
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
    if (oldInterest.date && oldInterest.period) {
      // Parse the send date using moment
      const parsedSendDate = moment(oldInterest.date, 'D/M/YYYY');

      // Calculate the maturity date by adding the period to the send date
      const calculatedMaturityDate = parsedSendDate.add(
        parseInt(oldInterest.period),
        'months',
      );

      // Format the calculated maturity date as "D/M/YYYY" and set it to state
      // Format the calculated maturity date as "D/M/YYYY" and convert it to string
      const formattedMaturityDate = calculatedMaturityDate.format('DD/MM/YYYY');
      console.log('formattedMaturityDate', formattedMaturityDate);

      // Set the formatted maturity date to the state
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          maturityDate: formattedMaturityDate,
        };
      });
    }
  }, [oldInterest.date, oldInterest.period]);

  useEffect(() => {
    // Check if both send date and period are valid
    if (newInterest.date && newInterest.period) {
      // Parse the send date using moment
      const parsedSendDate = moment(newInterest.date, 'D/M/YYYY');

      // Calculate the maturity date by adding the period to the send date
      const calculatedMaturityDate = parsedSendDate.add(
        parseInt(newInterest.period),
        'months',
      );

      // Format the calculated maturity date as "D/M/YYYY" and set it to state
      // Format the calculated maturity date as "D/M/YYYY" and convert it to string
      const formattedMaturityDate = calculatedMaturityDate.format('DD/MM/YYYY');
      console.log('formattedMaturityDate', formattedMaturityDate);

      // Set the formatted maturity date to the state
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          maturityDate: formattedMaturityDate,
        };
      });
    }
  }, [newInterest.date, newInterest.period]);

  useEffect(() => {
    if (amount && oldInterest.rate && oldInterest.period) {
      const interestAmount =
        ((parseInt(amount) * parseFloat(oldInterest.rate)) / 100 / 12) *
        parseInt(oldInterest.period);
      console.log('interestAmount', interestAmount);

      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          interest: interestAmount,
        };
      });
    } else {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          interest: 0,
        };
      });
    }
  }, [amount, oldInterest.rate, oldInterest.period]);

  useEffect(() => {
    if (amount && newInterest.rate && newInterest.period) {
      const interestAmount =
        ((parseInt(amount) * parseFloat(newInterest.rate)) / 100 / 12) *
        parseInt(newInterest.period);

      console.log('interestAmount', interestAmount);

      setNewInterest(newInterest => {
        return {
          ...newInterest,
          interest: interestAmount,
        };
      });
    } else {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          interest: 0,
        };
      });
    }
  }, [amount, newInterest.rate, newInterest.period]);

  useEffect(() => {
    if (amount && oldInterest.interest) {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          totalAmount: parseInt(amount) + oldInterest.interest,
        };
      });
    } else {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          totalAmount: 0,
        };
      });
    }
  }, [oldInterest.interest]);

  useEffect(() => {
    if (amount && newInterest.interest) {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          totalAmount: parseInt(amount) + newInterest.interest,
        };
      });
    } else {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          totalAmount: 0,
        };
      });
    }
  }, [newInterest.interest]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Số tiền gửi</Text>
        <Text>VNĐ</Text>
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

      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: Colors.text.red,
              width: '100%',
              textAlign: 'justify',
            }}>
            &#8251; Tiếp tục gửi tiết kiệm với lãi suất hiện tại
          </Text>

          <Text style={[styles.title, {marginTop: 0, width: '100%'}]}>
            Kỳ hạn hiện tại
          </Text>
          <Dropdown
            style={{
              width: '100%',
            }}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Chọn thời hạn gửi' : '...'}
            placeholderStyle={{
              color: Colors.text.lightgrey,
            }}
            value={oldInterest.period}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setOldInterest(oldInterest => {
                return {
                  ...oldInterest,
                  period: item.value,
                };
              });
              setIsFocus(false);
            }}
          />

          <Text style={[styles.title, {width: '100%'}]}>Lãi suất hiện tại</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              keyboardType="number-pad"
              style={styles.inputText}
              value={oldInterest.rate}
              maxLength={5}
              placeholder={'Nhập lãi suất'}
              placeholderTextColor={Colors.text.lightgrey}
              onChangeText={(value: string) => {
                handleRateChange(value, 'old');
              }}
            />
            <Text>
              {'%'} {'/'} năm
            </Text>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>Ngày đáo hạn</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              editable={false}
              style={styles.inputText}
              value={oldInterest.date}
              placeholder={'Chọn ngày đáo hạn'}
              placeholderTextColor={Colors.text.lightgrey}
            />

            <DatePicker
              modal
              open={oldInterest.openPicker}
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
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });
                // setDateString(dateFormat(value.toString()));
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    date: dateFormat(value.toISOString()),
                  };
                });
              }}
              onCancel={() => {
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });
              }}
            />
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {date && (
                <Ionicons
                  onPress={() =>
                    setOldInterest(oldInterest => {
                      return {
                        ...oldInterest,
                        date: '',
                      };
                    })
                  }
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )}
              <Ionicons
                onPress={() => {
                  setOldInterest(oldInterest => {
                    return {
                      ...oldInterest,
                      openPicker: true,
                    };
                  });
                }}
                name={'calendar'}
                style={styles.inputIcon}
              />
            </View>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>
            Ngày đáo hạn kế tiếp
          </Text>
          <Text
            style={{
              color: Colors.text.grey,
              width: '100%',
              marginVertical: 3,
            }}>
            {oldInterest.maturityDate}
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>Số tiền lãi</Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(oldInterest.interest).toString())} VNĐ
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>
            Số tiền khi đến hạn
          </Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(oldInterest.totalAmount).toString())} VNĐ
          </Text>
        </View>

        <View
          style={{
            height: '100%',
            borderLeftWidth: 0.5,
            borderLeftColor: Colors.border.lightgrey,
          }}
        />

        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: Colors.text.red,
              width: '100%',
              textAlign: 'justify',
            }}>
            &#8251; Gửi tiết kiệm với lãi suất mới
          </Text>
          <Text style={[styles.title, {marginTop: 0, width: '100%'}]}>
            Kỳ hạn mới
          </Text>
          <Dropdown
            style={{
              width: '100%',
            }}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Chọn kỳ hạn gửi' : '...'}
            placeholderStyle={{
              color: Colors.text.lightgrey,
            }}
            value={newInterest.period}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setNewInterest(newInterest => {
                return {
                  ...newInterest,
                  period: item.value,
                };
              });
              setIsFocus(false);
            }}
          />

          <Text style={[styles.title, {width: '100%'}]}>Lãi suất mới</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              keyboardType="number-pad"
              style={styles.inputText}
              value={newInterest.rate}
              maxLength={5}
              placeholder={'Nhập lãi suất'}
              placeholderTextColor={Colors.text.lightgrey}
              onChangeText={(value: string) => {
                handleRateChange(value, 'new');
              }}
            />
            <Text>
              {'%'} {'/'} năm
            </Text>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>Ngày gửi mới</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              editable={false}
              style={styles.inputText}
              value={newInterest.date}
              placeholder={'Chọn ngày gửi'}
              placeholderTextColor={Colors.text.lightgrey}
            />

            <DatePicker
              modal
              open={newInterest.openPicker}
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
                setNewInterest(newInterest => {
                  return {
                    ...newInterest,
                    openPicker: false,
                  };
                });
                setNewInterest(newInterest => {
                  return {
                    ...newInterest,
                    date: dateFormat(value.toISOString()),
                  };
                });
              }}
              onCancel={() => {
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });
              }}
            />
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {date && (
                <Ionicons
                  onPress={() =>
                    setNewInterest(newInterest => {
                      return {
                        ...newInterest,
                        date: '',
                      };
                    })
                  }
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )}
              <Ionicons
                onPress={() => {
                  setNewInterest(newInterest => {
                    return {
                      ...newInterest,
                      openPicker: true,
                    };
                  });
                }}
                name={'calendar'}
                style={styles.inputIcon}
              />
            </View>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>Ngày đáo hạn</Text>
          <Text
            style={{
              color: Colors.text.grey,
              width: '100%',
              marginVertical: 3,
            }}>
            {newInterest.maturityDate}
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>Số tiền lãi</Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(newInterest.interest).toString())} VNĐ
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>
            Số tiền khi đến hạn
          </Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(newInterest.totalAmount).toString())} VNĐ
          </Text>
        </View>
      </View>

      {/* <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'baseline',
          marginVertical: 10,
        }}>
        <Text style={styles.title}>
          Số tiền chênh lệch (Số tiền cũ - Số tiền mới)
        </Text>
        <Text style={styles.amountText}>
          {splitString(
            Math.abs(oldInterest.interest - newInterest.interest).toString(),
          )}{' '}
          VND
        </Text>
      </View> */}
    </ScrollView>
  );
};

export default InterestRateScreen;

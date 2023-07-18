import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {Calendar} from 'react-native-big-calendar';
import {
  AgendaList,
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
  WeekCalendar,
} from 'react-native-calendars';
import Modal from 'react-native-modal';

import {Colors} from '../../../../../constants/color.const';
import {getTaskList} from './services/task.service';
import {MarkedDates} from 'react-native-calendars/src/types';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const events = [
  {
    title: 'Meeting',
    start: new Date(2023, 6, 16, 10, 0),
    end: new Date(2023, 6, 16, 10, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2023, 6, 17, 15, 45),
    end: new Date(2023, 6, 17, 16, 30),
  },
];

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'TH1',
    'TH2',
    'TH3',
    'TH4',
    'TH5',
    'TH6',
    'TH7',
    'TH8',
    'TH9',
    'TH10',
    'TH11',
    'TH12',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
  today: 'Hôm nay',
};

LocaleConfig.defaultLocale = 'vi';

const ITEMS: any[] = [
  {
    title: '2023-07-14',
    data: [{startTime: '9:00', endTime: '11:00', title: 'Dọn nhà'}],
  },
  {
    title: '2023-07-18',
    data: [
      {startTime: '8:00', endTime: '9:00', title: 'Đi chợ'},
      {startTime: '17:00', endTime: '20:00', title: 'Họp gia đình'},
    ],
  },
];

const TaskListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route?.params?.groupId;

  const [selectedEvent, setSelectedEvent] = useState({
    title: '',
    start: '',
    end: '',
  });
  const [selected, setSelected] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const getTasks = async () => {
    const response = await getTaskList(groupId);
    console.log('Task list:', JSON.stringify(response, null, 2));
  };

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
    console.log('event:', event);
  };

  const handleDayPress = (day: any) => {
    console.log('day:', day);

    const selectedDate = day.dateString;
    const updatedMarkedDates = {
      // ...markedDates,
      [selectedDate]: {
        selected: true,
        selectedColor: Colors.background.orange,
      },
    };
    setMarkedDates(updatedMarkedDates);
  };
  function getMarkedDates() {
    const marked: MarkedDates = {};

    ITEMS.forEach(item => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0) {
        marked[item.title] = {marked: true};
      } else {
        marked[item.title] = {disabled: true};
      }
    });
    return marked;
  }

  const marked = getMarkedDates();

  useEffect(() => {
    console.log('groupId:', groupId);
    console.log('marked:', marked);

    getTasks();
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemTime}>
          {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* <Calendar
        locale="vi"
        headerContainerStyle={{backgroundColor: 'white', paddingTop: 10}}
        // weekDayHeaderHighlightColor={Colors.title.orange}
        // dayHeaderHighlightColor={Colors.title.orange}
        // dayHeaderStyle={{backgroundColor: 'white'}}
        headerComponentStyle={{
          backgroundColor: 'white',
        }}
        mode="month"
        showAllDayEventCell={true}
        bodyContainerStyle={{
          width: Dimensions.get('window').width,
          height: '100%',
          backgroundColor: 'white',
        }}
        eventCellStyle={{
          backgroundColor: 'pink',
        }}
        events={events}
        height={600}
        eventMinHeightForMonthView={20}
        hei
        onPressEvent={handleEventPress}
      /> */}

      {/* <Calendar
        // Customize the appearance of the calendar
        style={{
          width: Dimensions.get('window').width,
          height: '100%',
        }}
        theme={{
          arrowColor: 'orange',
          todayTextColor: Colors.text.orange,
          dayTextColor: Colors.text.grey,
        }}
        // Specify the current date
        current={new Date().toDateString()}
        // Callback that gets called when the user selects a day
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
        // Mark specific dates as marked
        // markedDates={{
        //   '2023-07-16': {selected: true, marked: true, selectedColor: 'orange'},
        //   '2023-07-14': {marked: true, dotColor: 'orange'},
        //   '2023-07-26': {selected: true, marked: true, selectedColor: 'orange'},
        // }}
        markedDates={markedDates}
      /> */}

      <CalendarProvider
        date={new Date().toDateString()}
        style={{width: '100%'}}>
        <ExpandableCalendar
          // markingType="multi-period"
          markedDates={marked}
          theme={{
            calendarBackground: 'white',
            arrowColor: 'orange',
            todayTextColor: Colors.text.orange,
            dayTextColor: Colors.text.grey,
            dotColor: Colors.text.orange,
            selectedDayBackgroundColor: Colors.background.orange,
            monthTextColor: Colors.text.grey,
          }}
        />
        <TouchableOpacity
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
            gap: 5,
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
          <Text
            style={{
              color: Colors.text.orange,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Thêm sự kiện
          </Text>
        </TouchableOpacity>
        <AgendaList
          sections={ITEMS}
          renderItem={renderItem}
          // scrollToNextEvent
          sectionStyle={{
            color: Colors.text.orange,
            fontSize: 18,
          }}
          style={{
            height: '100%',
          }}
          // dayFormat={'yyyy-MM-d'}
        />
      </CalendarProvider>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: 'pink',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalText}>
              {selectedEvent?.start.toString()} -{' '}
              {selectedEvent?.end.toString()}
            </Text>
          </TouchableOpacity>
          {/* Add more event information as needed */}
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  modalContainer: {
    height: 400,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.text.grey,
    fontWeight: 'bold',
  },
  modalText: {
    width: '100%',
    fontSize: 18,
    color: Colors.text.grey,
    textAlign: 'left',
  },
  modalButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  itemTime: {
    color: Colors.text.lightgrey,
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.grey,
  },
});

export default TaskListScreen;

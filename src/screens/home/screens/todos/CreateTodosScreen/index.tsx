import {Formik} from 'formik';
import React, {useEffect, useMemo, useState} from 'react';
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
import RadioGroup, {
  RadioButton,
  RadioButtonProps,
} from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {RouteProp, useRoute} from '@react-navigation/native';
import {createTodos} from './services/create.todos.service';
import Toast from 'react-native-toast-message';

const CreateTodoSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  todo: Yup.string().required('Vui lòng nhập tên việc cần làm'),
});

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const CreateTodosScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route?.params?.groupId;

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
        label: 'Công khai',
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

  const [todos, setTodos] = useState<Object[]>([]);

  useEffect(() => {
    // get value from radio button when selectedId changed
    console.log('selectedId', selectedId);
    console.log('radioButtons', radioButtons);

    const selectedRadioButton = radioButtons.find(e => e.id === selectedId);
    console.log('selectedRadioButton', selectedRadioButton);
    setSelectedOption(selectedRadioButton?.value);
  }, [selectedId]);

  useEffect(() => {
    console.log('todos', todos);
  }, [todos]);

  return (
    <Formik
      initialValues={{
        summary: '',
        todo: '',
        description: '',
        state: selectedOption,
      }}
      validationSchema={CreateTodoSchema}
      enableReinitialize={true}
      onSubmit={async values => {
        console.log('values', values);
        console.log('todos', todos);
        const checkList = {
          summary: values.summary,
          state: values.state,
          todos: todos,
        };
        console.log('checkList', JSON.stringify(checkList, null, 2));

        const response = await createTodos(groupId, checkList);
        console.log('Create todos response:', response);

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: 'Xóa khoản chỉ tiêu thành công',
            autoHide: true,
            visibilityTime: 1000,
            topOffset: 30,
            onHide: () => {
              navigation.navigate(RouteNames.TODOS_LIST, {
                groupId: groupId,
              });
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: response.message,
            autoHide: false,
            topOffset: 30,
          });
        }
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
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
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

          <Text style={styles.title}>Chế độ</Text>
          <RadioGroup
            containerStyle={{
              width: '90%',
              display: 'flex',
              alignItems: 'flex-start',
              // backgroundColor: 'yellow',
              gap: 10,
              marginVertical: 10,
            }}
            layout="column"
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
          />

          <Text style={styles.title}>Việc cần làm</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('todo', value)}
              onBlur={() => setFieldTouched('todo')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tên việc cần làm'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.todo}
            />
            {values.todo && (
              <Ionicons
                onPress={() => setFieldValue('todo', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {(touched.todo && errors.todo && (
            <Text style={styles.error}>{errors.todo}</Text>
          )) ||
            (errors.todo && <Text style={styles.error}>{errors.todo}</Text>)}

          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập mô tả'}
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

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('values', values);

              if (values.todo !== '') {
                if (todos.length === 0) {
                  setTodos([
                    {
                      todo: values.todo,
                      description: values.description,
                      isCompleted: false,
                    },
                  ]);
                } else {
                  setTodos([
                    ...todos,
                    {
                      todo: values.todo,
                      description: values.description,
                      isCompleted: false,
                    },
                  ]);
                }
              } else {
                setFieldError('todo', 'Vui lòng nhập tên việc cần làm');
              }
            }}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>

          <View
            style={{
              width: '90%',
              display: 'flex',
              gap: 10,
            }}>
            {todos.length > 0 &&
              todos.map((todo: any, index) => (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    // marginVertical: 5,
                    // backgroundColor: '#fff6e8',
                    backgroundColor: Colors.itemBackground.lightorange,
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <CheckBox
                    tintColors={{true: Colors.checkBox.orange}}
                    disabled={false}
                    value={true}
                    onValueChange={newValue => {
                      console.log('newValue', newValue);
                    }}
                  />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      gap: 10,
                    }}>
                    <Text
                      style={{
                        color: Colors.text.grey,
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      {todo.todo}
                    </Text>
                    <Text
                      style={{
                        color: Colors.text.lightgrey,
                        fontSize: 12,
                      }}>
                      {todo.description}
                    </Text>
                  </View>
                </View>
              ))}
          </View>

          <TouchableOpacity
            disabled={!isValid}
            onPress={handleSubmit}
            style={[
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
                borderRadius: 10,
                width: '90%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              },
            ]}>
            <Text
              style={{
                color: Colors.buttonText.white,
                fontSize: 16,
                fontWeight: 'bold',
                padding: 10,
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
    backgroundColor: Colors.background.white,
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    marginTop: 20,
  },
  inputContainer: {
    width: '90%',
    // height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    // marginVertical: 10,
    marginBottom: 10,
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
  addButton: {
    width: '90%',
    backgroundColor: Colors.buttonBackground.white,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
  },
  addButtonText: {
    color: Colors.buttonText.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTodosScreen;

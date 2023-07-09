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

const CreateTodoSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  todo: Yup.string().required('Vui lòng nhập tên việc cần làm'),
  description: Yup.string().required('Vui lòng nhập mô tả việc cần làm'),
  state: Yup.string().required('Vui lòng chọn trạng thái'),
});

const CreateTodosScreen = ({navigation}: {navigation: any}) => {
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
        state: '',
      }}
      validationSchema={CreateTodoSchema}
      onSubmit={values => {
        console.log('values', values);
      }}>
      {({
        setFieldValue,
        setFieldTouched,
        setFieldError,
        handleSubmit,
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

          {todos.length > 0 &&
            todos.map((todo: any, index) => (
              <View
                key={index}
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginVertical: 10,
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
                <Text>{todo.todo}</Text>
                <Text>{todo.description}</Text>
              </View>
            ))}
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
    padding: 10,
  },
  addButtonText: {
    color: Colors.buttonText.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTodosScreen;

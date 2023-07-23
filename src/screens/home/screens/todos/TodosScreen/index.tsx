import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {deleteTodo, getTodosById} from './services/todos.service';
import {Colors} from '../../../../../constants/color.const';

// Define the type for the route params
type TodosRouteParams = {
  todosId: string;
};

// Specify the type for the route
type TodosRouteProp = RouteProp<Record<string, TodosRouteParams>, string>;

const TodosSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
});

const TodosScreen = () => {
  const route = useRoute<TodosRouteProp>();
  const todosId = route?.params?.todosId;

  const [todos, setTodos] = useState({
    _id: '',
    summary: '',
    todos: [
      {
        _id: '',
        todo: '',
        description: '',
        isCompleted: false,
      },
    ],
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    todos.todos.map(() => false),
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const getTodos = async () => {
    const todosRes = await getTodosById(todosId);
    console.log('todos', JSON.stringify(todosRes, null, 2));

    setTodos({
      _id: todosRes.todos._id,
      summary: todosRes.todos.summary,
      todos: todosRes.todos.todos.map((todoItem: any) => {
        return {
          _id: todoItem._id,
          todo: todoItem.todo,
          description: todoItem.description,
          isCompleted: todoItem.isCompleted,
        };
      }),
    });
  };

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);

    // set "isCompleted" from todos at index to new value
    const updatedTodos = todos.todos.map((todo, i) => {
      if (i === index) {
        return {
          ...todo,
          isCompleted: newValue,
        };
      }
      return todo;
    });

    console.log('updatedTodos:', updatedTodos);
    setTodos({
      ...todos,
      todos: updatedTodos,
    });
  };

  useEffect(() => {
    console.log('todosId:', todosId);
    getTodos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTodos();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  useEffect(() => {
    console.log('todos:', todos);
  }, [todos]);

  return (
    <Formik
      initialValues={{
        summary: todos?.summary,
      }}
      validationSchema={TodosSchema}
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

          <Text style={styles.title}>Việc cần làm</Text>
          <View style={styles.checkBoxContainer}>
            {todos.todos.length > 0 &&
              todos.todos.map((todo: any, index) => (
                <View key={index} style={styles.todosContainer}>
                  <View style={styles.todo}>
                    <CheckBox
                      tintColors={{true: Colors.checkBox.orange}}
                      disabled={false}
                      value={toggleCheckBoxArray[index]}
                      // value={todos.todos[index].isCompleted}
                      onValueChange={newValue => {
                        handleToggleCheckBox(index, newValue);
                        console.log('newValue', newValue);

                        console.log('toggle', toggleCheckBoxArray[index]);

                        if (newValue !== toggleCheckBoxArray[index]) {
                          console.log('checked');
                        } else {
                          console.log('unchecked');
                        }
                      }}
                    />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <TextInput
                        value={todo.todo}
                        style={[
                          {
                            color: Colors.text.grey,
                            fontWeight: 'bold',
                            fontSize: 16,
                            height: 20,
                            padding: 0,
                          },
                          toggleCheckBoxArray[index]
                            ? {
                                textDecorationLine: 'line-through',
                              }
                            : {},
                        ]}
                      />
                      {todo.description && (
                        <TextInput
                          value={todo.description}
                          style={{
                            color: Colors.text.lightgrey,
                            fontSize: 12,
                            height: 20,
                            padding: 0,
                            // backgroundColor: 'yellow',
                          }}
                        />
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(!isModalVisible);
                    }}>
                    <Ionicons
                      name={'remove-circle'}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>

                  <Modal isVisible={isModalVisible}>
                    <View
                      style={{
                        display: 'flex',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        gap: 10,
                        padding: 20,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          textAlign: 'left',
                          color: Colors.text.grey,
                        }}>
                        Xóa việc cần làm?
                      </Text>

                      <View
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 30,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setIsModalVisible(!isModalVisible);
                          }}
                          style={{
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{fontSize: 16, color: Colors.text.orange}}>
                            Huỷ
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            setIsModalVisible(!isModalVisible);
                            const response = await deleteTodo(
                              todosId,
                              todo._id,
                            );
                            console.log('Delete todo response:', response);
                          }}
                          style={{
                            alignItems: 'center',
                          }}>
                          <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              ))}
          </View>
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
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  removeIcon: {
    fontWeight: '200',
    color: 'red',
    fontSize: 24,
  },
  checkBoxContainer: {
    width: '90%',
    display: 'flex',
    gap: 10,
    marginTop: 10,
  },
  todosContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 5,
    // marginVertical: 5,
    // backgroundColor: '#fff6e8',
    backgroundColor: Colors.itemBackground.lightorange,
    padding: 10,
    borderRadius: 10,
  },
  todo: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default TodosScreen;

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

import {
  addTodos,
  deleteTodoInList,
  editSummary,
  getTodosById,
  updateTodoInList,
} from './services/todos.service';
import {Colors} from '../../../../../constants/color.const';

// Define the type for the route params
type TodosRouteParams = {
  todosId: string;
};

// Specify the type for the route
type TodosRouteProp = RouteProp<Record<string, TodosRouteParams>, string>;

const TodosSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  todoName: Yup.string().required('Vui lòng nhập tiêu đề'),
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
    state: '',
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    todos.todos.map(todo => todo.isCompleted),
  );

  const [deleteTodo, setDeleteTodo] = useState({
    _id: '',
    todoName: '',
  });
  const [newTodoInfo, setNewTodoInfo] = useState({
    todoName: '',
    todoDescription: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  const [isDeleteTodosModalVisible, setIsDeleteTodosModalVisible] =
    useState(false);

  const getTodos = async () => {
    const todosRes = await getTodosById(todosId);
    // console.log('todos', JSON.stringify(todosRes, null, 2));

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
      state: todosRes.todos.state,
    });

    setToggleCheckBoxArray(
      todosRes.todos.todos.map((todo: any) => todo.isCompleted),
    );
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
    // console.log('todos:', todos);
  }, [todos]);

  return (
    <Formik
      initialValues={{
        summary: todos?.summary,
        todoName: '',
        todoDescription: '',
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
        handleChange,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onEndEditing={async () => {
                console.log('values.summary:', values.summary);
                const response = await editSummary(todosId, values.summary);
                console.log('Edit summary response:', response);
              }}
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

          <View style={[styles.titleContainer, {marginTop: 10}]}>
            <Text style={styles.title}>Việc cần làm</Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddTodoModalVisible(true);
              }}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={Colors.icon.orange}
              />
            </TouchableOpacity>
          </View>

          <Modal isVisible={isAddTodoModalVisible}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>Thêm việc cần làm</Text>

              <View style={[styles.inputContainer, {width: '100%'}]}>
                <TextInput
                  onChangeText={value => setFieldValue('todoName', value)}
                  onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('todoName')}
                  // onChangeText={text => setSummary(text)}
                  style={styles.inputText}
                  placeholder={'Nhập việc cần làm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.todoName}
                />
                {values.todoName && (
                  <Ionicons
                    onPress={() => setFieldValue('todoName', '')}
                    name={'close'}
                    style={styles.inputIcon}
                  />
                )}
              </View>
              {touched.todoName && errors.todoName && (
                <Text style={styles.error}>{errors.todoName}</Text>
              )}

              <View style={[styles.inputContainer, {width: '100%'}]}>
                <TextInput
                  onChangeText={value =>
                    setFieldValue('todoDescription', value)
                  }
                  onBlur={() => setFieldTouched('todoDescription')}
                  // onChangeText={text => setSummary(text)}
                  style={styles.inputText}
                  placeholder={'Nhập mô tả việc cần làm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.todoDescription}
                />
                {values.todoDescription && (
                  <Ionicons
                    onPress={() => setFieldValue('todoDescription', '')}
                    name={'close'}
                    style={styles.inputIcon}
                  />
                )}
              </View>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddTodoModalVisible(false);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: Colors.text.orange}}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    const response = await addTodos(todos._id, {
                      todos: [
                        {
                          todo: values.todoName,
                          description: values.todoDescription,
                          isCompleted: false,
                        },
                      ],
                      state: todos.state,
                    });
                    console.log(
                      'Add new response:',
                      JSON.stringify(response, null, 2),
                    );

                    if (response.statusCode === 200) {
                      setFieldValue('todoName', '');
                      setFieldTouched('todoName', false);
                      setFieldValue('todoDescription', '');
                      getTodos();
                    }

                    setIsAddTodoModalVisible(false);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
                      onValueChange={async newValue => {
                        handleToggleCheckBox(index, newValue);
                        console.log('newValue', newValue);

                        console.log('toggle', toggleCheckBoxArray[index]);

                        if (newValue !== toggleCheckBoxArray[index]) {
                          console.log('checked');

                          const response = await updateTodoInList(
                            todosId,
                            todo._id,
                            {
                              todo: todo.todo,
                              description: todo.description,
                              isCompleted: newValue,
                            },
                          );

                          console.log(
                            'Update isCompleted response:',
                            JSON.stringify(response, null, 2),
                          );
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
                            : {
                                textDecorationLine: 'none',
                              },
                        ]}
                        onChangeText={newValue => {
                          todo.todo = newValue;
                          setNewTodoInfo({
                            todoName: newValue,
                            todoDescription: todo.description,
                          });
                        }}
                        onEndEditing={async () => {
                          console.log('newTodoInfo:', newTodoInfo);

                          const response = await updateTodoInList(
                            todosId,
                            todo._id,
                            {
                              todo: newTodoInfo.todoName,
                              description: todo.description,
                              isCompleted: todo.isCompleted,
                            },
                          );
                        }}
                      />
                      {todo.description && (
                        <TextInput
                          value={todo.description}
                          style={{
                            color: Colors.text.lightgrey,
                            fontSize: 12,
                            height: 20,
                            padding: 0,
                          }}
                          onChangeText={newValue => {
                            todo.description = newValue;
                            setNewTodoInfo({
                              todoName: todo.todo,
                              todoDescription: newValue,
                            });
                          }}
                          onEndEditing={async () => {
                            console.log('newTodoInfo:', newTodoInfo);

                            const response = await updateTodoInList(
                              todosId,
                              todo._id,
                              {
                                todo: todo.todo,
                                description: newTodoInfo.todoDescription,
                                isCompleted: todo.isCompleted,
                              },
                            );

                            console.log(
                              'Update todo description response:',
                              JSON.stringify(response, null, 2),
                            );
                          }}
                        />
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(!isModalVisible);
                      setDeleteTodo({_id: todo._id, todoName: todo.todo});
                    }}>
                    <Ionicons
                      name={'remove-circle'}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          <Modal
            isVisible={isModalVisible}
            style={{
              backgroundColor: 'transparent',
            }}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>
                Xóa "{deleteTodo.todoName}" khỏi danh sách danh sách việc cần
                làm?
              </Text>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: Colors.text.orange}}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setIsModalVisible(!isModalVisible);
                    const response = await deleteTodoInList(
                      todosId,
                      deleteTodo._id,
                    );

                    console.log('Delete todo response:', response);

                    if (response.statusCode === 200) {
                      getTodos();
                    }
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setIsDeleteTodosModalVisible(true);
            }}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>

          <Modal isVisible={isDeleteTodosModalVisible}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>Xóa việc cần làm?</Text>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteTodosModalVisible(!isDeleteTodosModalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: Colors.text.orange}}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setIsDeleteTodosModalVisible(!isDeleteTodosModalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  titleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
    color: Colors.icon.red,
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
  modalContentContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 10,
    gap: 10,
    padding: 20,
  },
  modalTextContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'left',
    color: Colors.text.grey,
  },
  deleteButton: {
    width: '90%',
    // height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.buttonBackground.red,
    borderRadius: 10,
    marginVertical: 20,
  },
  deleteButtonText: {
    color: Colors.text.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TodosScreen;

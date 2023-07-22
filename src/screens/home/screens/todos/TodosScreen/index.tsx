import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {getTodosById} from './services/todos.service';

// Define the type for the route params
type TodosRouteParams = {
  todosId: string;
};

// Specify the type for the route
type TodosRouteProp = RouteProp<Record<string, TodosRouteParams>, string>;

type TodosProps = {
  _id: string;
  summary: string;
  todos: [
    {
      _id: string;
      todo: string;
      description: string;
      isCompleted: boolean;
    },
  ];
};

const TodosScreen = () => {
  const route = useRoute<TodosRouteProp>();
  const todosId = route?.params?.todosId;

  const [todos, setTodos] = useState<TodosProps>();

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

  useEffect(() => {
    console.log('todosId:', todosId);
    getTodos();
  }, []);

  useEffect(() => {
    console.log('todos:', todos);
  }, [todos]);

  return (
    <View>
      <TextInput placeholder="Tiêu đề" value={todos?.summary}></TextInput>
    </View>
  );
};

export default TodosScreen;

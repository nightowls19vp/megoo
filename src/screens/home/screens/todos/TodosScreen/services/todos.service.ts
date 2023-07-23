import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTodosById = async (todosId: string) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${todosId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Get todos by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get todos error: ', error);
  }
};

export const updateTodo = async (
  todosId: string,
  todoId: string,
  todo: {todo: string; description: string; isCompleted: boolean},
) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/todo/${todoId}`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Update todo by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.put(
      reqUrl,
      {
        todo: todo.todo,
        description: todo.description,
        isCompleted: todo.isCompleted,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Update todo error: ', error);
  }
};

export const deleteTodo = async (todosId: string, todoId: string) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/todo`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Delete todo by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        todos: [
          {
            _id: todoId,
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete todo error: ', error);
  }
};

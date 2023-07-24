import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getTodosList} from './services/todos.list.service';

import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const TodosListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route?.params?.groupId;

  const [todos, setTodos] = useState([]);

  const getAllTodos = async () => {
    const todosRes = await getTodosList(groupId);
    console.log('todos', JSON.stringify(todosRes, null, 2));

    setTodos(
      todosRes.group.todos.map((todosItem: any) => {
        return {
          _id: todosItem._id,
          summary: todosItem.summary,
          todos: [
            {
              _id: todosItem.todos._id,
              todo: todosItem.todos.todo,
              description: todosItem.todos.description,
              isCompleted: todosItem.todos.isCompleted,
            },
          ],
          state: todosItem.state,
          createdBy: {
            _id: todosItem.createdBy._id,
            name: todosItem.createdBy.name,
            email: todosItem.createdBy.email,
            avatar: todosItem.createdBy.avatar,
          },
        };
      }),
    );
  };

  useEffect(() => {
    console.log('groupId:', groupId);
    getAllTodos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllTodos();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  const renderTodos = () => {
    return todos.map((todosItem: any) => {
      return (
        <TouchableOpacity
          key={todosItem._id}
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
            marginVertical: 10,
            padding: 10,
            gap: 10,
            borderRadius: 10,
            backgroundColor: Colors.background.white,
          }}
          onPress={() => {
            navigation.navigate(RouteNames.TODOS, {
              todosId: todosItem._id,
            });
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              Tiêu đề:
            </Text>
            <Text
              style={{
                color: Colors.text.grey,
              }}>
              {todosItem.summary}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
              }}
              source={{uri: todosItem.createdBy.avatar}}
            />
            <Text
              style={{
                color: Colors.text.grey,
              }}>
              {todosItem.createdBy.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách việc cần làm</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.CREATE_TODOS, {
              groupId: groupId,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>

      {renderTodos()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
});

export default TodosListScreen;

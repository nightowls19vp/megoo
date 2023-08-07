import {RouteProp, useRoute} from '@react-navigation/native';
import {useEffect} from 'react';
import {Text, View} from 'react-native';
import {getTaskById} from './services/task.service';

type TaskRouteParams = {
  taskId: string;
};

// Specify the type for the route
type TaskRouteProp = RouteProp<Record<string, TaskRouteParams>, string>;

const TaskDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<TaskRouteProp>();
  const taskId = route.params.taskId;

  const getTaskDetail = async () => {
    const response = await getTaskById(taskId);
    console.log('Get task response', response);
  };

  useEffect(() => {
    console.log('taskId', taskId);
    getTaskDetail();
  }, []);

  return (
    <View>
      <Text>Task</Text>
    </View>
  );
};

export default TaskDetailScreen;

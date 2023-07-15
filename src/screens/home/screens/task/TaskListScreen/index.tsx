import {Dimensions, StyleSheet, Text, View} from 'react-native';

const TaskListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Task list screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
  },
});

export default TaskListScreen;

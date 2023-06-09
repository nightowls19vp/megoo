import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import userStore from '../../../../common/store/user.store';
import {connect, createChannel} from './services/chat.service';

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Chat screen</Text>

      <TouchableOpacity
        style={{
          margin: 30,
          width: 100,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'orange',
        }}
        onPress={async () => {
          const user = await connect(userStore.id, userStore.email);
          await createChannel('group1', [`${userStore.id}`]);
          console.log('user: ', user);
        }}>
        <Text>button</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

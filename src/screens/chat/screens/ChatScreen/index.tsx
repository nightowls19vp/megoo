import {Image, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import userStore from '../../../../common/store/user.store';
import {createChannel} from '../../../../services/chat.service';
import {connectSendBird} from '../../../../services/chat.service';

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image
        source={{
          uri: 'https://res.cloudinary.com/nightowls19vp/image/upload/v1686492903/avatars/default/cpqy11mhxqlwlgvcpcyz.png',
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 100 / 2,
          backgroundColor: 'white',
        }}
      />
    </View>
  );
};

export default ChatScreen;

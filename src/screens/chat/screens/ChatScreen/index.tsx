import {useCallback, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Message,
  MessageContainer,
  MessageText,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {GroupChannel} from '@sendbird/chat/groupChannel';

import userStore from '../../../../common/store/user.store';
import {SendBirdChatService} from '../../../../services/sendbird-chat.service';
import {getMessages, sendMessage} from './services/chat.service';
import {Colors} from '../../../../constants/color.const';

// Define the type for the route params
type ChannelUrlRouteParams = {
  channelUrl: string;
};

// Specify the type for the route
type ChannelUrlRouteProp = RouteProp<
  Record<string, ChannelUrlRouteParams>,
  string
>;

const renderBubble = (props: any) => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    // containerStyle={{
    //   left: {borderColor: 'teal', borderWidth: 8},
    //   right: {},
    // }}
    wrapperStyle={{
      left: {
        // borderColor: 'tomato', borderWidth: 4,
        backgroundColor: 'white',
      },
    }}
    // bottomContainerStyle={{
    //   left: {borderColor: 'purple', borderWidth: 4},
    //   right: {},
    // }}
    tickStyle={{}}
    usernameStyle={{color: 'tomato', fontWeight: '100'}}
    containerToNextStyle={{
      left: {borderColor: 'navy', borderWidth: 4},
      right: {},
    }}
    containerToPreviousStyle={{
      left: {borderColor: 'mediumorchid', borderWidth: 4},
      right: {},
    }}
  />
);

const renderMessage = (props: any) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: {backgroundColor: 'lime'},
      right: {backgroundColor: 'gold'},
    }}
  />
);

const renderMessageText = (props: any) => (
  <MessageText
    {...props}
    // containerStyle={{
    //   left: {backgroundColor: 'yellow'},
    //   right: {backgroundColor: 'purple'},
    // }}

    textStyle={{
      left: {color: 'red'},
      right: {color: 'green'},
    }}
    linkStyle={{
      left: {color: 'orange'},
      right: {color: 'orange'},
    }}
    customTextStyle={{fontSize: 18}}
  />
);

const renderSystemMessage = (props: any) => (
  <SystemMessage
    {...props}
    containerStyle={{backgroundColor: 'pink'}}
    wrapperStyle={{borderWidth: 10, borderColor: 'white'}}
    textStyle={{color: 'crimson', fontWeight: '900'}}
  />
);

const renderInputToolbar = (props: any) => (
  <InputToolbar
    {...props}
    containerStyle={{
      // backgroundColor: '#222B45',
      paddingTop: 6,
      paddingLeft: -10,
    }}
    primaryStyle={{alignItems: 'center'}}
  />
);

const renderSend = (props: any) => (
  <Send
    {...props}
    // disabled={!props.text}
    containerStyle={{
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}
    // label={'Gửi'}
    // textStyle={{color: 'orange'}}
  >
    <Ionicons
      name="send"
      size={24}
      color="#007aff"
      style={{
        paddingBottom: 10,
      }}
    />
  </Send>
);

const renderComposer = (props: any) => {
  return (
    <Composer
      {...props}
      placeholder="Nhập tin nhắn..."
      placeholderTextColor="#999999"
    />
  );
};

const ChatScreen = () => {
  const route = useRoute<ChannelUrlRouteProp>();
  const channelUrl = route.params.channelUrl;
  const [messages, setMessages] = useState<
    {
      _id: number;
      text: string;
      createdAt: Date;
      user: {
        _id: number;
        name: string;
        avatar: string;
      };
    }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<any>();
  const [message, setMessage] = useState('');
  let channel: GroupChannel;

  useEffect(() => {
    SendBirdChatService.getInstance()
      .sendbird.groupChannel.getChannel(channelUrl)
      .then((groupChannel: GroupChannel) => {
        channel = groupChannel;

        console.log('Get channel from SB:', channel.url);
        getMessages(channel).then((messages: any) => {
          console.log('abc msg:', messages);

          setMessages(messages);
        });
      });
  }, []);

  const onSend = useCallback((messages: any[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    sendMessage(channel, messages[0].text);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      // alignTop
      alwaysShowSend
      scrollToBottom
      messagesContainerStyle={{paddingBottom: 10}}
      renderBubble={renderBubble}
      // renderMessage={renderMessage}
      // renderMessageText={renderMessageText}
      // renderSystemMessage={renderSystemMessage}
      renderInputToolbar={renderInputToolbar}
      renderSend={renderSend}
      renderComposer={renderComposer}
      onSend={messages => onSend(messages)}
      user={{
        _id: userStore.id,
      }}
      renderActions={() => (
        <TouchableOpacity
          style={{
            marginRight: -5,
          }}
          onPress={async () => {
            await launchImageLibrary(
              // If need base64String, include this option:
              // includeBase64: true
              {mediaType: 'mixed', includeBase64: true},
              response => {
                // console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                  console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                  let source: Asset[] = response.assets as Asset[];
                  setSelectedImage(`${source[0].uri}`);
                  setImageFile(source[0].base64);
                  console.log('Image file:', source[0].uri);
                }
              },
            );
          }}>
          <Ionicons
            name="image"
            size={24}
            color={Colors.secondary}
            style={{
              paddingBottom: 5,
              paddingLeft: 10,
            }}
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default ChatScreen;

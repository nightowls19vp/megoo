import {useCallback, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Message,
  MessageContainer,
  MessageImage,
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
import {
  getMessages,
  sendMessage,
  sendMessageImageToSendBird,
  uploadImage,
} from './services/chat.service';
import {Colors} from '../../../../constants/color.const';
import {Image} from 'react-native-elements';

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
    // renderTicks={() => <Text>{props.currentMessage.image}</Text>}
    // containerStyle={{
    //   left: {borderColor: 'teal', borderWidth: 8},
    //   right: {},
    // }}
    // renderMessageImage={() => (
    //   <Image
    //     style={{width: 100, height: 100}}
    //     source={{uri: props.currentMessage.image}}
    //   />
    // )}
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
      left: {},
      right: {},
    }}
    containerToPreviousStyle={{
      left: {},
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

const renderMessageImage = (props: any) => (
  <MessageImage
    currentMessage={props}
    containerStyle={{
      width: 100,
      height: 100,
    }}
    imageProps={{resizeMode: 'center'}}
    imageStyle={{
      width: 100,
      height: 100,
    }}
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
    primaryStyle={{alignItems: 'center'}}></InputToolbar>
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

  const [isMounted, setIsMounted] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFilenames, setSelectedFilenames] = useState<string[]>([]);
  const [base64Strings, setBase64Strings] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  let channel: GroupChannel;

  useEffect(() => {
    SendBirdChatService.getInstance()
      .sendbird.groupChannel.getChannel(channelUrl)
      .then((groupChannel: GroupChannel) => {
        channel = groupChannel;

        getMessages(channel).then((messages: any) => {
          setMessages(messages);
        });

        setIsMounted(true);
      });
  }, []);

  const onSend = useCallback((messages: any[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    sendMessage(channel, messages[0].text);
  }, []);

  const sendMessageImage = async (channel: GroupChannel) => {
    selectedImages.forEach(async (image: string, index: number) => {
      // console.log('index:', index);
      // console.log('base64String:', base64Strings[index]);
      console.log('selectedFilenames:', selectedFilenames[index]);

      const fileExtension = image.split('.').pop();
      const base64String = `data:image/${fileExtension};base64,${base64Strings[index]}`;
      // console.log('base64String:', base64String);

      uploadImage(base64String).then((imageURL: any) => {
        console.log('response:', imageURL);

        if (imageURL.statusCode === 200) {
          sendMessageImageToSendBird(
            channel,
            selectedFilenames[index],
            imageURL.data,
          );
        }
      });
    });
  };

  useEffect(() => {
    console.log('messages:', messages);
  }, [messages]);

  useEffect(() => {
    console.log('selectedImages:', selectedImages);
    console.log('selectedFilenames:', selectedFilenames);

    if (
      isMounted &&
      selectedImages.length > 0 &&
      selectedFilenames.length > 0 &&
      base64Strings.length > 0
    ) {
      SendBirdChatService.getInstance()
        .sendbird.groupChannel.getChannel(channelUrl)
        .then((groupChannel: GroupChannel) => {
          channel = groupChannel;
          console.log('channel.url:', channel.url);

          sendMessageImage(channel);

          getMessages(channel).then((messages: any) => {
            console.log('Messages after send image:', messages);

            setMessages(messages);
          });
        });
    }
  }, [selectedImages, selectedFilenames, base64Strings]);

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
      // renderMessageImage={renderMessageImage}
      renderInputToolbar={renderInputToolbar}
      renderSend={renderSend}
      renderComposer={renderComposer}
      // onSend={messages => onSend(messages)}
      onSend={messages => onSend(messages)}
      user={{
        _id: userStore.id,
        name: userStore.name,
        avatar: userStore.avatar,
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
              {mediaType: 'mixed', selectionLimit: 5, includeBase64: true},
              response => {
                // console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                  console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                  let source: Asset[] = response.assets as Asset[];
                  setSelectedImages(source.map(image => `${image.uri}`));
                  setSelectedFilenames(
                    source.map(image => `${image.fileName}`),
                  );
                  setBase64Strings(source.map(image => `${image.base64}`));
                  // console.log('Image file:', source);

                  // setMessages(previousMessages =>
                  //   GiftedChat.append(previousMessages, [
                  //     {
                  //       _id: new Date().getTime(),
                  //       text: '',
                  //       createdAt: new Date(),
                  //       image: `${source[0].uri}`,
                  //       user: {
                  //         _id: userStore.id,
                  //         name: userStore.name,
                  //         avatar: userStore.avatar,
                  //       },
                  //     },
                  //   ]),
                  // );
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

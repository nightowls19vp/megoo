import {
  BaseMessage,
  MessageListParams,
  UserMessageCreateParams,
} from '@sendbird/chat/message';
import {GroupChannel} from '@sendbird/chat/groupChannel';

export const getMessages = async (channel: GroupChannel) => {
  try {
    const params: MessageListParams = {
      prevResultSize: 5,
      nextResultSize: 5,
      // ...
    };
    const messages: BaseMessage[] = await channel.getMessagesByTimestamp(
      0,
      params,
    );
    console.log('messages by timestamp', messages.length);

    // Reverse message array by message.createdAt
    messages.reverse();

    return messages.map((message: any) => {
      return {
        _id: message.messageId,
        text: message.message,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.sender.userId,
          name: message.sender.nickname,
          avatar: message.sender.plainProfileUrl,
        },
      };
    });
  } catch (e) {
    // Todo: Handle error
    console.log('get messages error', e);

    return [];
  }
};

export const sendMessage = async (channel: GroupChannel, message: string) => {
  try {
    const params: UserMessageCreateParams = {
      message: message,
    };

    channel.sendUserMessage(params).onSucceeded((message: any) => {
      const messageId = message.messageId;
      console.log('after send message', message);
    });
  } catch (e) {}
};

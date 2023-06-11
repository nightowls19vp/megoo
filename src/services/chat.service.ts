import SendBird from 'sendbird';
import {sendbird} from '../../App';

// const appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';
// const sendbird = new SendBird({appId});

export const connectSendBird = (userId: string, nickname: string) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.connect(userId, (user, error) => {
      if (error) {
        reject(error);
      } else {
        sb.updateCurrentUserInfo(
          decodeURIComponent(nickname),
          '',
          (user, error) => {
            error ? reject(error) : resolve(user);
          },
        );
      }
    });
  });
};

export const createChannel = async (channelName: string, userIds: string[]) => {
  try {
    const params = new sendbird.GroupChannelParams();

    params.addUserIds(userIds);
    params.name = channelName;

    const channel = await sendbird.GroupChannel.createChannel(params);
    console.log('Channel created:', channel);
  } catch (error) {
    console.error('Error creating channel:', error);
  }
};

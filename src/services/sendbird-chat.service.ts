import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SendbirdChat, {SendbirdChatParams} from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
} from '@sendbird/chat/groupChannel';
import {OpenChannelModule} from '@sendbird/chat/openChannel';

import userStore from '../common/store/user.store';
import {URL_HOST} from '../core/config/api/api.config';

// const appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';

// const params = {
//   appId: appId,
//   modules: [new GroupChannelModule()],
// };

// export const sendbird = SendbirdChat.init(params);

// export const connectSendBird = async (userId: string) => {
//   try {
//     const user = await sendbird.connect(userId);

//     return user;
//   } catch (error) {
//     console.log("Error connecting to SendBird's server:", error);
//   }
// };

// export const createGroupChannel = async (
//   channelName: string,
//   userIds: string[],
// ) => {
//   try {
//     const params: GroupChannelCreateParams = {
//       invitedUserIds: userIds,
//       name: channelName,
//     };

//     const channel: GroupChannel = await sendbird.groupChannel.createChannel(
//       params,
//     );

//     return channel;
//   } catch (error) {
//     console.error('Error creating channel:', error);
//   }
// };

// export const getChannels = async () => {
//   const getChannelsEndpoint = `api/pkg-mgmt/gr/user_id/channel`;
//   const reqUrl = `${URL_HOST}${getChannelsEndpoint}`;
//   console.log('Get channels group:', reqUrl);

//   const accessToken = await AsyncStorage.getItem('accessToken');

//   try {
//     const response = await axios.get(reqUrl, {
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.log('Get channels error:', error);
//   }
// };

// export const createChannel = async (groupId: string, channelUrl: string) => {
//   const createChannelEndpoint = `api/pkg-mgmt/gr/${groupId}/channel`;
//   const reqUrl = `${URL_HOST}${createChannelEndpoint}`;
//   console.log('Create channel group:', reqUrl);

//   const accessToken = await AsyncStorage.getItem('accessToken');

//   try {
//     const response = await axios.post(
//       reqUrl,
//       {
//         channel: channelUrl,
//       },
//       {
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     console.log('Create channel error:', error);
//   }
// };

/**
 * Singleton class for SendBird Chat SDK
 */
export class SendBirdChatService {
  private static instance: SendBirdChatService;

  private static appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';

  private static params = {
    appId: SendBirdChatService.appId,
    modules: [new GroupChannelModule()],
  };

  public sendbird = SendbirdChat.init(SendBirdChatService.params);

  private constructor() {}

  public static getInstance(): SendBirdChatService {
    if (!SendBirdChatService.instance) {
      SendBirdChatService.instance = new SendBirdChatService();
    }

    return SendBirdChatService.instance;
  }

  public async connect(userId: string) {
    try {
      const user = await this.sendbird.connect(userId);

      return user;
    } catch (error) {
      console.log("Error connecting to SendBird's server:", error);
    }
  }

  /**
   * Create a group channel on SendBird server
   * @param channelName: name of the channel
   * @param userIds: list of user IDs to invite to the channel
   * @return channel: GroupChannel if successful, undefined otherwise
   */
  public async createGroupChannel(
    channelName: string,
    userIds: string[],
  ): Promise<GroupChannel | undefined> {
    try {
      const params: GroupChannelCreateParams = {
        invitedUserIds: userIds,
        name: channelName,
      };

      const channel: GroupChannel =
        await SendBirdChatService.getInstance().sendbird.groupChannel.createChannel(
          params,
        );

      return channel;
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  }

  public async getChannels() {
    const getChannelsEndpoint = `api/pkg-mgmt/gr/user_id/channel`;
    const reqUrl = `${URL_HOST}${getChannelsEndpoint}`;
    console.log('Get channels group:', reqUrl);

    const accessToken = await AsyncStorage.getItem('accessToken');

    try {
      const response = await axios.get(reqUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Get channels error:', error);
    }
  }

  public async createChannel(groupId: string, channelUrl: string) {
    const createChannelEndpoint = `api/pkg-mgmt/gr/${groupId}/channel`;
    const reqUrl = `${URL_HOST}${createChannelEndpoint}`;
    console.log('Create channel group:', reqUrl);

    const accessToken = await AsyncStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        reqUrl,
        {
          channel: channelUrl,
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
      console.log('Create channel error:', error);
    }
  }
}

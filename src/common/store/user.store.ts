import { action, makeAutoObservable, observable, reaction } from "mobx";
import { IUser } from '../interfaces/user.interface';
import { IValidateRes } from '../interfaces/validate.interface';
import { ISettings } from './../interfaces/settings.interface';
import axios from 'axios';
import { URL_HOST } from "../../core/config/api/api.config";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserStore {
  @observable id = "";
  @observable name = "";
  @observable email = "";
  @observable phone = "";
  @observable dob = "";
  @observable avatar = "";
  @observable msgNoti!: boolean;
  @observable callNoti!: boolean;
  @observable newsNoti!: boolean;
  @observable stockNoti!: boolean;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => [this.callNoti, this.msgNoti, this.newsNoti, this.stockNoti],

      async () => {
        try {
          console.log("Msg:", this.msgNoti);
          console.log("Call:", this.callNoti);
          console.log("Stock:", this.stockNoti);
          console.log("News:", this.newsNoti);

          const settingEndpoint = `api/users/${this.id}/setting`;
          const reqUrl = `${URL_HOST}${settingEndpoint}`;
          console.log("Setting:", reqUrl);

          const accessToken = await AsyncStorage.getItem("accessToken");

          const response = await axios.put(reqUrl, {
            callNoti: this.callNoti,
            msgNoti: this.msgNoti,
            stockNoti: this.stockNoti,
            newsNoti: this.newsNoti,
          }, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // this.setCallNoti(response.data.data.setting.callNoti);
          // this.setMsgNoti(response.data.datasetting.msgNoti);
          // this.setStockNoti(response.data.data.setting.stockNoti);
          // this.setNewsNoti(response.data.data.setting.newsNoti);

          console.log("Setting update res:", response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            let response: IValidateRes = {
              statusCode: error.response?.status ?? 500,
              message: error.response?.statusText ?? "",
            };

            console.log("Setting update error:", error.response?.data);
          }
        }
      }

    )
  }

  @action setUserSettings(settings: ISettings) {
    this.callNoti = settings.callNoti ?? this.callNoti;
    this.msgNoti = settings.msgNoti ?? this.msgNoti;
    this.stockNoti = settings.stockNoti ?? this.stockNoti;
    this.newsNoti = settings.newsNoti ?? this.newsNoti;
  }

  @action setCallNoti(state: boolean) {
    this.callNoti = state;
  }

  @action setMsgNoti(state: boolean) {
    this.msgNoti = state;
  }

  @action setStockNoti(state: boolean) {
    this.stockNoti = state;
  }

  @action setNewsNoti(state: boolean) {
    this.newsNoti = state;
  }

  @action setUser(user: IUser) {
    this.id = user._id ?? this.id;
    this.name = user.name ?? this.name;
    this.email = user.email ?? this.email;
    this.phone = user.phone ?? this.phone;
    this.dob = user.dob ?? this.dob;
    this.avatar = user.avatar ?? this.avatar;
  }

  @action setName(name: string) {
    this.name = name;
  }

  @action setPhone(phone: string) {
    this.phone = phone;
  }

  @action setEmail(email: string) {
    this.email = email;
  }

  @action setDob(dob: string) {
    this.dob = dob;
  }

  @action setAvatar(avatar: string) {
    this.avatar = avatar;
  }



}

const userStore = new UserStore();
export default userStore;
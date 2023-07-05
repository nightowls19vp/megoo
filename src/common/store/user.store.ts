import {
  action,
  extendObservable,
  makeAutoObservable,
  observable,
  reaction,
} from 'mobx';
import {IUser} from '../interfaces/user.interface';
import {IValidateRes} from '../interfaces/validate.interface';
import {ISettings} from './../interfaces/settings.interface';
import axios from 'axios';
import {URL_HOST} from '../../core/config/api/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ICartItem, ICartList, IPackage} from '../interfaces/package.interface';

class UserStore {
  @observable id = '';
  @observable name = '';
  @observable email = '';
  @observable phone = '';
  @observable dob = '';
  @observable avatar = '';
  @observable msgNoti = true;
  @observable callNoti = true;
  @observable newsNoti = true;
  @observable stockNoti = true;
  @observable cartList: ICartList = {
    cart: [] as ICartItem[],
  };

  constructor() {
    // this.reset();

    makeAutoObservable(this);

    reaction(
      () => [this.callNoti, this.msgNoti, this.newsNoti, this.stockNoti],

      async () => {
        try {
          const settingEndpoint = `api/users/${this.id}/setting`;
          const reqUrl = `${URL_HOST}${settingEndpoint}`;
          console.log('Setting:', reqUrl);

          const accessToken = await AsyncStorage.getItem('accessToken');

          const response = await axios.put(
            reqUrl,
            {
              callNoti: this.callNoti,
              msgNoti: this.msgNoti,
              stockNoti: this.stockNoti,
              newsNoti: this.newsNoti,
            },
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          console.log('Setting update res:', response.data.statusCode);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            let response: IValidateRes = {
              statusCode: error.response?.status ?? 500,
              message: error.response?.statusText ?? '',
            };

            console.log('Setting update error:', error.response?.data);
          }
        }
      },
    );
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

  @action setCartList(list: ICartList) {
    this.cartList = list;
  }

  @action addCartItem(item: ICartItem) {
    this.cartList.cart.push(item);
  }

  @action resetArray() {
    this.cartList.cart = []; // Assigning an empty array to reset the observable array
  }

  @action resetStore() {
    this.id = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.dob = '';
    this.avatar = '';
    this.msgNoti = true;
    this.callNoti = true;
    this.newsNoti = true;
    this.stockNoti = true;
    this.cartList = {
      cart: [],
    };
  }
}

const userStore = new UserStore();
export default userStore;

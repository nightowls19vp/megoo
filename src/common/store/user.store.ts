import { action, makeAutoObservable, observable } from "mobx";
import { IUser } from '../interfaces/user.interface';
import { ISettings } from './../interfaces/settings.interface';

class UserStore {
    @observable id = "";
    @observable name = "";
    @observable email = "";
    @observable phone = "";
    @observable dob = "";
    @observable avatar = "";
    @observable settingId = "";
    @observable callNoti = true;
    @observable msgNoti = true;
    @observable newsNoti = true;
    @observable stockNoti = true;

    constructor() {
        makeAutoObservable(this)
    }

    @action setUser(user: IUser) {
        this.id = user._id || this.id;
        this.name = user.name || this.name;
        this.email = user.email || this.email;
        this.phone = user.phone || this.phone;
        this.dob = user.dob || this.dob;
        this.avatar = user.avatar || this.avatar;
    }

    @action setUserSettings(settings: ISettings) {
        this.settingId = settings._id || this.settingId;
        this.callNoti = settings.callNoti || this.callNoti;
        this.msgNoti = settings.msgNoti || this.msgNoti;
        this.newsNoti = settings.newsNoti || this.newsNoti;
        this.stockNoti = settings.stockNoti || this.stockNoti;
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

    @action setNewsNoti(state: boolean) {
        this.newsNoti = state;
    }
}

const userStore = new UserStore();
export default userStore;
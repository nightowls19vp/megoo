import { action, makeAutoObservable, observable } from "mobx";
import { IUser } from './../../interfaces/user.interface';

class UserStore {
    @observable id = "";
    @observable name = "";
    @observable email = "";
    @observable phone = "";
    @observable dob = "";
    @observable avatar = "";

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
}

const userStore = new UserStore();
export default userStore;
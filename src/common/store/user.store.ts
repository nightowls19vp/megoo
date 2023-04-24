import { action, observable } from "mobx";
import { IUser } from './../../interfaces/user.interface';

class UserStore {
    @observable id = "";
    @observable name = "";
    @observable email = "";
    @observable phone = "";
    @observable dob = "";
    @observable avatar = "";

    @action setUser(user: IUser) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.dob = user.dob;
        this.avatar = user.avatar;
    }
}

const userStore = new UserStore();
export default userStore;
import { action, makeAutoObservable, observable } from "mobx";

class AppStore {
    @observable isLoggedIn = false;

    constructor() {
        makeAutoObservable(this)
    }

    @action setIsLoggedIn(state: boolean) {
        this.isLoggedIn = state;
    }
}

const appStore = new AppStore();
export default appStore;
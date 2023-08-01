import {action, makeAutoObservable, observable} from 'mobx';

class GroupStore {
  @observable id = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action setGroupId(groupId: string) {
    this.id = groupId;
  }

  @action resetGroupId() {
    this.id = '';
  }
}

const groupStore = new GroupStore();
export default groupStore;

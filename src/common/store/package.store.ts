import { action, makeAutoObservable, observable } from "mobx";
import { IPackage } from './../interfaces/package.interface';

class PackageStore {
    @observable id = "";
    @observable name = "";
    @observable duration = 0;
    @observable price = 0;
    @observable noOfMember = 0;
    @observable description = "";

    constructor() {
        makeAutoObservable(this)
    }

    @action setPackage(pkg: IPackage) {
        this.id = pkg._id;
        this.name = pkg.name;
        this.duration = pkg.duration;
        this.price = pkg.price;
        this.noOfMember = pkg.noOfMember;
        this.description = pkg.description;
    }

    @action setPrice(price: number) {
        this.price = price;
    }

    @action setNoOfMember(noOfMember: number) {
        this.noOfMember = noOfMember;
    }

    @action setDuration(duration: number) {
        this.duration = duration;
    }
}

const packageStore = new PackageStore();
export default packageStore;
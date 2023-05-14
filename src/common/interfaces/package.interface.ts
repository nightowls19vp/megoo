export interface IPackage {
    _id: string;
    name: string;
    duration: number;
    price: number;
    noOfMember: number;
    description: string;
}

export interface ICartItem {
    package: string,
    quantity: number,
    noOfMemb: number,
    duration: number,
}

export interface ICartList {
    cart: ICartItem[],
}
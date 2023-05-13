export interface GetAllPkgRes {
    data?: any;
}

export interface CartItem {
    package: string,
    quantity: number,
    noOfMemb: number,
    duration: number,
}

export interface CartReq {
    cart: CartItem[],
}
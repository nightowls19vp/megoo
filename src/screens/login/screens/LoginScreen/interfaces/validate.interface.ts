import { IUser } from "../../../../../interfaces/user.interface";

export interface IValidateRes {
    statusCode: number;
    message: string;
    userInfo: IUser;
}
import { IUser } from "./user.interface";

export interface IValidateRes {
    statusCode: number;
    message: string;
    user?: IUser;
}
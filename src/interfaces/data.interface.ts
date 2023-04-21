import { IUser } from "./user.interface";

export interface IData {
  authData: IAuthData;
  userInfo: IUser;
}

export interface IAuthData {
  id: string;
  username: string;
  role: string;
  password: string;
  hashedPassword: string;
}

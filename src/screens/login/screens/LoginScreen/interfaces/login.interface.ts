import { IData } from "../../../../../interfaces/data.interface";

export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  statusCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  data?: IData;
}

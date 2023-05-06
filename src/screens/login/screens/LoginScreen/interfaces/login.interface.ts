import { IData } from "../../../../../interfaces/data.interface";
import { IToken } from "../../../../../interfaces/token.interface";

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

export interface IGoogleLoginRes {
  statusCode: number;
  message: string;
  data?: IToken;
}

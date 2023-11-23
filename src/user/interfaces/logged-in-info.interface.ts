import { IUserInfo } from "./user-info.interface";

export interface ILoggedInInfo {
  user: IUserInfo;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

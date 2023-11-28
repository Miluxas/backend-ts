import { IUserInfo } from "./user-info.interface";

export type AuthorizedRequest = {
  user: IUserInfo;
  rbContent?: any;
};

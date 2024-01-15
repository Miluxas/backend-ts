import { IUserInfo } from "../../common/user-info.interface";

export type AuthorizedRequestType = {
  user: IUserInfo;
  isMobileApp: boolean;
};

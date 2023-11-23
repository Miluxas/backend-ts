import { IUserInfo } from '../interfaces';

export type AuthorizedRequestType = {
  user: IUserInfo;
  isMobileApp: boolean;
};

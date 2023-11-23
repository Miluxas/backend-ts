import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum UserError {
  NOT_FOUND = 'NOT_FOUND',
}

export const userErrorMessages: IMessageList<UserError> = {
  [UserError.NOT_FOUND]: {
    message: 'User not found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

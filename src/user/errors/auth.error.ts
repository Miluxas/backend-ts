import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum AuthError {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_IS_NOT_VERIFIED = 'EMAIL_IS_NOT_VERIFIED',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
}

export const authErrorMessages: IMessageList<AuthError> = {
 
  [AuthError.TOKEN_EXPIRED]: {
    message: 'Token is expired',
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.TOKEN_INVALID]: {
    message: 'Token is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.INVALID_EMAIL]: {
    message: 'Email is not valid!',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.WRONG_PASSWORD]: {
    message: 'Password is wrong!',
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.EMAIL_IS_NOT_VERIFIED]: {
    message: 'Email is not verified',
    status: HttpStatus.BAD_REQUEST,
  },
};

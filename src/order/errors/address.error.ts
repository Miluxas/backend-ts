import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum AddressError {
  ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',
}

export const addressErrorMessages: IMessageList<AddressError> = {
 
  [AddressError.ADDRESS_NOT_FOUND]: {
    message: 'Address not found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

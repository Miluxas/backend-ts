import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum ParcelError {
  NOT_POSSIBLE = 'NOT_POSSIBLE',
}

export const parcelErrorMessages: IMessageList<ParcelError> = {
 
  [ParcelError.NOT_POSSIBLE]: {
    message: 'Parceling is not possible',
    status: HttpStatus.BAD_REQUEST,
  },
  
};

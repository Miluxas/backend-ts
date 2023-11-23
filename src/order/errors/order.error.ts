import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum OrderError {
  SKU_INVALID = 'SKU_INVALID',
}

export const orderErrorMessages: IMessageList<OrderError> = {
 
  [OrderError.SKU_INVALID]: {
    message: 'Sku is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  
};

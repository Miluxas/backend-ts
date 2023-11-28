import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum OrderError {
  SKU_INVALID = 'SKU_INVALID',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
}

export const orderErrorMessages: IMessageList<OrderError> = {
 
  [OrderError.SKU_INVALID]: {
    message: 'Sku is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [OrderError.ORDER_NOT_FOUND]: {
    message: 'Order not found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

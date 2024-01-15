import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum PaymentError {
  PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND',
}

export const paymentErrorMessages: IMessageList<PaymentError> = {
 
  [PaymentError.PAYMENT_NOT_FOUND]: {
    message: 'Payment not found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

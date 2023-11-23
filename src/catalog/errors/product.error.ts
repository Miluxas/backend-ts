import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum ProductError {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
}

export const ProductErrorMessages: IMessageList<ProductError> = {
  [ProductError.PRODUCT_NOT_FOUND]: {
    message: 'Product not found',
    status: HttpStatus.NOT_FOUND,
  },
};

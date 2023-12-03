import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum ShoppingCartError {
  SKU_INVALID = 'SKU_INVALID',
  SHOPPING_CART_NOT_FOUND = 'SHOPPING_CART_NOT_FOUND',
}

export const shoppingCartErrorMessages: IMessageList<ShoppingCartError> = {
 
  [ShoppingCartError.SKU_INVALID]: {
    message: 'Sku is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [ShoppingCartError.SHOPPING_CART_NOT_FOUND]: {
    message: 'Shopping cart not found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

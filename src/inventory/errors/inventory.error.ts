import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum InventoryError {
  SKU_INVALID = 'SKU_INVALID',
  PARCELING_IS_IMPOSSIBLE = 'PARCELING_IS_IMPOSSIBLE',
}

export const inventoryErrorMessages: IMessageList<InventoryError> = {
 
  [InventoryError.SKU_INVALID]: {
    message: 'Sku is invalid',
    status: HttpStatus.UNAUTHORIZED,
  },
  [InventoryError.PARCELING_IS_IMPOSSIBLE]: {
    message: 'Parceling is impossible',
    status: HttpStatus.BAD_REQUEST,
  },
  
};

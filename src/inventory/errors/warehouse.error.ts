import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum WarehouseError {
  WarehousE_NOT_FOUND = 'WarehousE_NOT_FOUND',
}

export const warehouseErrorMessages: IMessageList<WarehouseError> = {
 
  [WarehouseError.WarehousE_NOT_FOUND]: {
    message: 'Warehouse NOT found',
    status: HttpStatus.NOT_FOUND,
  },
  
};

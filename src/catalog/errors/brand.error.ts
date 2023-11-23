import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum BrandError {
  BRAND_NOT_FOUND = 'BRAND_NOT_FOUND',
}

export const BrandErrorMessages: IMessageList<BrandError> = {
  [BrandError.BRAND_NOT_FOUND]: {
    message: 'Brand not found',
    status: HttpStatus.NOT_FOUND,
  },
};

import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum CategoryError {
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
}

export const CategoryErrorMessages: IMessageList<CategoryError> = {
  [CategoryError.CATEGORY_NOT_FOUND]: {
    message: 'Category not found',
    status: HttpStatus.NOT_FOUND,
  },
};

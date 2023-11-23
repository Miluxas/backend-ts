import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum VariableTypeError {
  VARIABLE_TYPE_NOT_FOUND = 'VARIABLE_TYPE_NOT_FOUND',
}

export const VariableTypeErrorMessages: IMessageList<VariableTypeError> = {
  [VariableTypeError.VARIABLE_TYPE_NOT_FOUND]: {
    message: 'VariableType not found',
    status: HttpStatus.NOT_FOUND,
  },
};

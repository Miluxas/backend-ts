import { HttpStatus } from '@nestjs/common';

export interface ErrorHandler {
  getMessage(error: Error): void;
}

export type IMessageList<T extends string> = {
  [key in T]: {
    message: string;
    status: HttpStatus;
  };
};

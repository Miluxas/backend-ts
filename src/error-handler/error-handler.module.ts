import { DynamicModule, Module } from '@nestjs/common';
import { ErrorHandlerService } from './error-handler.service';
import { ERROR_MESSAGES } from './constant';
import { IMessageList } from './error-handler.interface';

@Module({})
export class ErrorHandlerModule {
  static register(messages: IMessageList<any>): DynamicModule {
    return {
      module: ErrorHandlerModule,
      providers: [
        {
          provide: ERROR_MESSAGES,
          useValue: messages,
        },
        ErrorHandlerService,
      ],
      exports: [ErrorHandlerService],
    };
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { message, status }: any = exception;
    if (status === HttpStatus.UNAUTHORIZED)
      response.status(status).json({
        meta: {
          code: status,
        },
      });
    else
      response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        meta: {
          message,
          code: status,
        },
      });
  }
}

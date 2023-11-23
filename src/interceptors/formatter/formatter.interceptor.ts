import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ErrorResponseMessageType,
  ManipulatedRequest,
  StandardErrorResponse,
  StandardResponse,
} from './formatter.interface';

@Injectable()
export class ResponseFormatter implements NestInterceptor {
  private readonly customMessageKeys = ['meta', 'payload'];
  private readonly stdErrorResponseKeys = ['meta'];
  constructor(
    protected readonly configService: ConfigService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<ManipulatedRequest>();
    const res = context.switchToHttp().getResponse<Response>();
    if (req.url.includes('files')) {
      if (res.statusCode === 200) return next.handle();
    }
    if (req.url.includes('export')) {
      if (res.statusCode === 201) return next.handle();
    }
    req['requestedAt'] = Date.now();
    context.getClass();
    return next
      .handle()
      .pipe(
        map(this.formatResponse(req, res)),
        catchError(this.formatError(res, req)),
      );
  }

  formatResponse(req: ManipulatedRequest, res: Response) {
    const method = req.method;
    return async (response): Promise<StandardResponse | any> => {
      if (method === 'DELETE') {
        res.statusCode = HttpStatus.NO_CONTENT;
        return;
      } else if (!response) {
        return {
          message: 'Resource not found!',
          payload: {},
        };
      }
      if (response.status) {
        res.statusCode = response.status;
      }
      const status = method === 'POST' ? HttpStatus.CREATED : HttpStatus.OK;
      res.statusCode = status;
      if (
        typeof response === 'object' &&
        this.customMessageKeys.every((key) => key in response)
      ) {
        return {
          message: response.message,
          payload:  response.payload,
        };
      }
      return {
        payload:  response,
      };
    };
  }

  formatError(response: Response, request: ManipulatedRequest) {
    return async (err: any): Promise<StandardErrorResponse> => {
      let meta = null;
      if (err.message === 'mime type problem') {
        response.statusCode = HttpStatus.BAD_REQUEST;
        meta = {
          message: 'Wrong file type. I just accept doc, jpeg, png, pdf',
          code: HttpStatus.BAD_REQUEST,
          messageType: ErrorResponseMessageType.ERROR,
        };
      } else if (
        typeof err === 'object' &&
        this.stdErrorResponseKeys.some((key) => !(key in err))
      ) {
        const env = this.configService.get('NODE_ENV');
        const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          err.message ?? env !== 'prod'
            ? err?.message
            : 'Internal Server Error';
        response.statusCode = status;
        meta = {
          message: message,
          code: status,
          messageType: ErrorResponseMessageType.ERROR,
        };
      }
      if (meta) {
        return { meta };
      }
      response.statusCode = err.status ? err.status : response.statusCode;
      delete err.status;
      return err;
    };
  }
}

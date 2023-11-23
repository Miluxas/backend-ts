import { Request } from 'express';

export interface StandardResponse {
  message?: string;
  payload: any;
}
export enum ErrorResponseMessageType {
  ERROR = 'error',
  WARMING = 'warning',
  VALIDATION_ERROR = 'validationError',
}
export interface StandardErrorResponse {
  meta: {
    code: number;

    message: string;

    messageType: ErrorResponseMessageType;

    validationErrors?: Record<string, string[]>;
  };
}

export interface ManipulatedRequest extends Request {
  requestId: string;
}

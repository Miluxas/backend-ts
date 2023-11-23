import { HttpStatus } from '@nestjs/common';
import { IMessageList } from '../../error-handler/error-handler.interface';

export enum MediaError {
  MEDIA_NOT_FOUND = 'MEDIA_NOT_FOUND',
}

export const MediaErrorMessages: IMessageList<MediaError> = {
  [MediaError.MEDIA_NOT_FOUND]: {
    message: 'Media not found',
    status: HttpStatus.NOT_FOUND,
  },
};

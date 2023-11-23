import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { MediaController } from './controllers/media.controller';
import { Media, MediaSchema } from './models/media.model';
import { MediaErrorMessages } from './errors';
import { MediaService } from './services/media.service';
import { StorageService } from './services/storage.service';
import { ImageProxyService } from './services/image-proxy.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
    ErrorHandlerModule.register({
      ...MediaErrorMessages,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, StorageService, ImageProxyService],
  exports: [MediaService],
})
export class MediaModule {}

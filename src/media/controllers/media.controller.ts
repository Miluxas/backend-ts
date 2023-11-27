import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createHash } from 'crypto';
import { mkdir } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import { GetMediaDetailResponseDto } from '../DTOs';
import { INewMedia } from '../interfaces';
import { MediaService } from '../services/media.service';
import { MediaAcceptableMimeTypes, MediaType, mediaExtensions } from '../types';
import { Authorization } from '../../common/authorization.decorator';

export const LOCAL_PATH = join(__dirname, '../', '../', 'uploaded-files');
const s3Path = 'images';

@ApiTags('Media')
@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {
    mkdir(LOCAL_PATH, { recursive: true }, (err) => {
      if (err) console.error(err);
    });
  }

  @Post()
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetMediaDetailResponseDto),
  })
  @ApiBadRequestResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          cb(
            null,
            createHash('sha256')
              .update(
                JSON.stringify({
                  name: file.originalname,
                  size: file.size,
                  uploadedAt: Date.now(),
                }),
              )
              .digest('hex') + mediaExtensions.get(file.mimetype),
          );
        },
        destination: (req, file, cb) => cb(null, LOCAL_PATH),
      }),
      limits: { fileSize: 5242880 }, // 5MB
      fileFilter: (req, file, cb) => {
        const isValidFile = (
          Object.values(MediaAcceptableMimeTypes) as string[]
        ).includes(file.mimetype);
        cb(isValidFile ? null : new Error('mime type problem'), isValidFile);
      },
    }),
  )
  async uploadFile(
    @UploadedFile('file') file,
    @Req() req,
  ): Promise<GetMediaDetailResponseDto | void> {
    const metaData: INewMedia = {
      originalName: file.originalname,
      obfuscatedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      creatorId: req.user?.id ?? 0,
      localPath: LOCAL_PATH,
      type: MediaType.image,
    };
    return this.mediaService
      .saveMedia(metaData, s3Path)
      .then((media) => {
        return {
          _id: media._id.toHexString(),
          originalName: metaData.originalName,
          obfuscatedName: metaData.obfuscatedName,
          url: media.url,
          size: file.size,
        };
      })
      .catch((error) => {
        throw error;
      });
  }
}

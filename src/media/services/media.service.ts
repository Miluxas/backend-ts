import {  Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { unlink } from 'fs/promises';
import { Model } from 'mongoose';
import { join } from 'path';
import { Media, MediaDocument } from '../models/media.model';
import { IMediaInfo, INewMedia } from '../interfaces';
import { ImageProxyService } from './image-proxy.service';
import { StorageService } from './storage.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly imageProxyService: ImageProxyService,
  ) {}

  async saveMedia(metaData: INewMedia, s3Path: string): Promise<Media> {
    const media = new Media();
    const uploaded = await this.storageService.uploadPublicFile(
      metaData.obfuscatedName,
      metaData.localPath,
      s3Path,
    );
    media.url = uploaded.Location;
    media.originalName = metaData.originalName;
    media.obfuscatedName = metaData.obfuscatedName;
    media.mimeType = metaData.mimeType;
    media.size = metaData.size;
    media.type = metaData.type;
    media.creatorId = metaData.creatorId;
    media.storage = 's3';

    unlink(join(metaData.localPath, metaData.obfuscatedName));
    console.log(`${metaData.obfuscatedName} **REMOVED** :)`);
    return (await this.mediaModel.create(media)).save();
  }

  async getMedia(_id: string): Promise<IMediaInfo> {
    const cacheKey = `cashedMedia${_id}`;
    const cachedMedia = await this.cacheManager.get(cacheKey) as IMediaInfo;
    if (cachedMedia) return cachedMedia;
    const loadedMedia = await this.mediaModel.findById(_id);
    if (!loadedMedia) return null;
    const foundMediaInfo: IMediaInfo = {
      id: loadedMedia.id,
      url: loadedMedia.url,
      size: loadedMedia.size,
    };
    if (this.configService.get('IMGPROXY_URL') && loadedMedia.url) {
      const sizes = this.configService.get('IMGPROXY_SIZES')?.split(',') || [
        '80@1',
        '200@2',
        '400@1',
        '400@2',
        '800@1',
        '800@2',
        '@1',
        '@2',
      ];
      const variants = this.imageProxyService.getLinks(loadedMedia.url, sizes);
      Object.assign(foundMediaInfo, { variants });
    }

    await this.cacheManager.set(cacheKey, foundMediaInfo);

    return foundMediaInfo;
  }
}

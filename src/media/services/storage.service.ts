import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      region: 'fra1',
    });
  }

  public async uploadPublicFile(
    filename: string,
    localPath: string,
    folder: string,
  ): Promise<any> {
    const FILE = join(localPath, filename);
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${folder}/${filename}`,
      Body: readFileSync(FILE),
      ACL: 'public-read',
    };

    return this.s3.upload(params).promise();
  }

  public async uploadPrivateFile(
    filename: string,
    localPath: string,
    folder: string,
  ): Promise<any> {
    const FILE = join(localPath, filename);
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${folder}/${filename}`,
      Body: readFileSync(FILE),
    };
    return this.s3.upload(params).promise();
  }

  public async getDownloadLink(folder, filename) {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${folder}/${filename}`,
    };
    return new Promise((resolve) => {
      this.s3.headObject(params, (err, data) => {
        if (!data) return resolve(null);
        this.s3.getSignedUrl('getObject', params, (err2, url) => {
          if (err2) return resolve(null);

          return resolve(url);
        });
      });
    });
  }

  public async checkPublicFileExist(
    filename: string,
    s3Folder: string,
  ): Promise<boolean> {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${s3Folder}/${filename}`,
    };
    return new Promise((resolve) => {
      this.s3.headObject(params, (err, data) => {
        if (!data) return resolve(false);
        this.s3.getSignedUrl('getObject', params, (err2) => {
          if (err2) return resolve(false);

          return resolve(true);
        });
      });
    });
  }

  public async deletePublicFile(filename: string): Promise<any> {
    const folder = 'attachments';
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${folder}/${filename}`,
    };
    return this.s3.deleteObject(params).promise();
  }

  public async getPrivateFile(Key: string): Promise<any> {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key,
    };
    return this.s3.getObject(params).createReadStream();
  }
}

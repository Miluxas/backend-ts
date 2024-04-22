import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'fra1',
      endpoint: this.configService.get('S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  public async uploadPublicFile(
    filename: string,
    localPath: string,
    folder: string,
  ): Promise<any> {
    const FILE = join(localPath, filename);
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: `${folder}/${filename}`,
        Body: readFileSync(FILE),
        ACL: 'public-read',
      }),
    );
  }

  public async uploadPrivateFile(
    filename: string,
    localPath: string,
    folder: string,
  ): Promise<any> {
    const FILE = join(localPath, filename);
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: `${folder}/${filename}`,
        Body: readFileSync(FILE),
      }),
    );
  }

  public async getDownloadLink(folder, filename) {
    const s3Params = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: `${folder}/${filename}`,
    };
    const command = new PutObjectCommand(s3Params);
    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 600,
      });
      console.log(signedUrl);
      return signedUrl;
    } catch (err) {
      return null;
    }
  }

  public async checkPublicFileExist(
    filename: string,
    s3Folder: string,
  ): Promise<boolean> {
    return this.s3Client
      .send(
        new HeadObjectCommand({
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Key: `${s3Folder}/${filename}`,
        }),
      )
      .then((value) => true)
      .catch((err) => false);
  }

  public async deletePublicFile(filename: string): Promise<any> {
    const folder = 'attachments';
    return this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: `${folder}/${filename}`,
      }),
    );
  }

  public async getPrivateFile(Key: string): Promise<any> {
    return this.s3Client
      .send(
        new GetObjectCommand({
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Key,
        }),
      )
      .then((res) => res.Body.transformToWebStream());
  }
}

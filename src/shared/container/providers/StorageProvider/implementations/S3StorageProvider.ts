import fs from 'fs';
import path from 'path';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import mime from 'mime';

import uploadConfig from '../../../../../config/upload';
import { IStorageProvider } from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  public async saveFile(file: string, folder: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    const putObject = new PutObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
      Body: fileContent,
    });

    await this.client.send(putObject);

    // await this.client
    //   .putObject({
    //     Bucket: `${process.env.AWS_BUCKET}/${folder}`,
    //     Key: file,
    //     ACL: 'public-read',
    //     Body: fileContent,
    //     ContentType,
    //   })
    //   .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string, folder: string): Promise<void> {
    const deleteObject = new DeleteObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
    });

    await this.client.send(deleteObject);

    // await this.client
    //   .deleteObject({
    //     Bucket: `${process.env.AWS_BUCKET}/${folder}`,
    //     Key: file,
    //   })
    //   .promise();
  }
}

export { S3StorageProvider };

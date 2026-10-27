import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly objectKey: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('ENDPOINT');
    const region = this.configService.get<string>('REGION') || 'auto';
    const accessKeyId = this.configService.get<string>('ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('SECRET_ACCESS_KEY');
    this.bucket = this.configService.get<string>('BUCKET') ?? '';
    this.objectKey = this.configService.get<string>('CV_OBJECT_KEY') ?? '';

    if (!endpoint || !accessKeyId || !secretAccessKey || !this.bucket || !this.objectKey) {
      this.logger.warn(
        'Configuración del bucket de CV incompleta: revisa ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET y CV_OBJECT_KEY.',
      );
    }

    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: accessKeyId ?? '',
        secretAccessKey: secretAccessKey ?? '',
      },
      forcePathStyle: true,
    });
  }

  async getCvStream(): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.objectKey,
    });

    const response = await this.client.send(command);
    return response.Body as Readable;
  }
}

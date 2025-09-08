import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly defaultBucket: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET') || '',
      },
      region:
        this.configService.get<string>('AWS_BUCKET_REGION') || 'us-east-1',
    });
    this.defaultBucket =
      this.configService.get<string>('AWS_DEFAULT_BUCKET') || 'bluesky-stage';
  }

  async uploadFileToS3(
    bucketName: string,
    key: string,
    fileBuffer: Buffer,
    orderId: string,
  ) {
    try {
      const fileExtension = extname(key).slice(1); // Remove dot from extension
      const s3Key = `${this.configService.get<string>('BUCKET_FOLDER') || 'uploads'}/orders/${orderId}/${key}`;

      const params = {
        Bucket: bucketName || this.defaultBucket,
        Key: s3Key,
        Body: fileBuffer, // Use Buffer directly
        ContentType: `application/${fileExtension}`, // Optional: Set ContentType
      };

      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      const url = `https://${bucketName || this.defaultBucket}.s3.${this.configService.get<string>('AWS_BUCKET_REGION')}.amazonaws.com/${s3Key}`;
      return { url, extension: fileExtension }; // Return full S3 URL
    } catch (error) {
      console.error('Error uploading file to S3:', error.message, error.stack);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}

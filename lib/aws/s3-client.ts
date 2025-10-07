// AWS S3 client configuration
import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.CUSTOM_AWS_ACCESS_KEY_ID || !process.env.CUSTOM_AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials not configured');
}

if (!process.env.CUSTOM_AWS_REGION || !process.env.CUSTOM_AWS_S3_BUCKET) {
  throw new Error('AWS S3 configuration not complete');
}

export const s3Client = new S3Client({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = process.env.CUSTOM_AWS_S3_BUCKET;
export const S3_REGION = process.env.CUSTOM_AWS_REGION;

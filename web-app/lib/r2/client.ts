import { S3Client } from '@aws-sdk/client-s3';

let client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be set.');
    }

    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || 'ethio-agency-hub';
}

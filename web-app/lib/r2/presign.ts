import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, getR2BucketName } from './client';

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn });
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

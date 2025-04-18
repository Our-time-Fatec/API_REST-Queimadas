import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { s3 } from "./s3";
import path from 'path';

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string, folder: string) {
  const bucketName = process.env.S3_BUCKET_NAME!;
  const fileExtension = path.extname(fileName);
  const newFileName = `${uuidv4()}${fileExtension}`;
  const cdnUrl = process.env.CLOUD_FRONT_CDN!

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folder}/${newFileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'private',
  });

  await s3.send(command);
  
  return {
    url: `${cdnUrl}/${folder}/${newFileName}`,
    originalFileName: fileName
  }
}

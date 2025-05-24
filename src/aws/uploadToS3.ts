import path from 'node:path'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import type { UploadToS3Props } from '#/@types/aws/props'
import { env } from '#/settings/env'
import { s3 } from './s3'

export async function uploadToS3({
  fileBuffer,
  fileName,
  folder,
  mimeType,
}: UploadToS3Props) {
  const bucketName = env.S3_BUCKET_NAME
  const fileExtension = path.extname(fileName)
  const newFileName = `${uuidv4()}${fileExtension}`
  const cdnUrl = env.CLOUD_FRONT_CDN

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folder}/${newFileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'private',
  })

  await s3.send(command)

  return {
    url: `${cdnUrl}/${folder}/${newFileName}`,
    originalFileName: fileName,
  }
}

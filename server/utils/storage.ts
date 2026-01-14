import type { PutObjectCommandInput } from '@aws-sdk/client-s3'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const storage = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION!,
})

export async function storageDelete(Key: string) {
    await storage.send(
        new DeleteObjectCommand({
            Bucket: 'quantum-click',
            Key,
        })
    )
}

export async function storageUpload(Key: string, Body: NonNullable<PutObjectCommandInput['Body']>, ContentType?: string) {
    await storage.send(
        new PutObjectCommand({
            Body,
            Bucket: 'quantum-click',
            ContentType: ContentType || 'application/octet-stream',
            Key,
        })
    )

    return `${process.env.R2_URL}/${Key}`
}

import type { PutObjectCommandInput } from '@aws-sdk/client-s3'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { extension } from 'mime-types'

const storage = new S3Client({
    credentials: {
        accessKeyId: '1ec7a224402e70013eea3529bfae44fc',
        secretAccessKey: 'e2307c0e87e3bdf1814c1a83c49015d8f42da0edf852b15bf005afd07aebb7d4',
    },
    endpoint: 'https://08d512e2dc849fcbee3a92a9ed49a626.r2.cloudflarestorage.com/quantum',
    region: 'auto',
})

export function storageUpload(id: string, body: NonNullable<PutObjectCommandInput['Body']>, mediaType: string) {
    const ext = extension(mediaType)
    if (!ext) throw new Error('No se pudo determinar la extensión del archivo.')
    const key = `${ext}/${id}.${ext}`
    storage.send(new PutObjectCommand({ Body: body, Bucket: 'quantum', ContentType: mediaType, Key: key }))
    return `https://pub-abed36ff824d48fd8f9c26ccf9913d7e.r2.dev/quantum/${key}`
}

import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { log } from '@/lib/logger'

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
  'video/3gpp', 'video/3gpp2',
]

const MAX_BYTES = 100 * 1024 * 1024 // 100 MB

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    log('WARN', 'upload: BLOB_READ_WRITE_TOKEN not set')
    return NextResponse.json({ error: 'Upload not available' }, { status: 503 })
  }

  const body = await request.json() as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_MIME_TYPES,
        maximumSizeInBytes: MAX_BYTES,
      }),
      onUploadCompleted: async ({ blob }) => {
        log('INFO', 'upload: completed', { url: blob.url })
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (err) {
    log('ERROR', 'upload: failed', { error: String(err) })
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 })
  }
}

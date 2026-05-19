import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { log } from '@/lib/logger'

// Explicit whitelist — do not use file.type directly for contentType or branching,
// as it is client-supplied and can be spoofed.
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
  'video/3gpp', 'video/3gpp2', // common on Android
])

// Derive extension from MIME type — camera captures often have no filename extension
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/heic': 'heic', 'image/heif': 'heif',
  'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
  'video/x-m4v': 'm4v', 'video/3gpp': '3gp', 'video/3gpp2': '3g2',
}

const MAX_BYTES = 100 * 1024 * 1024 // 100 MB

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    log('WARN', 'upload: BLOB_READ_WRITE_TOKEN not set, skipping upload')
    return NextResponse.json({ photoUrl: null })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    log('WARN', 'upload: rejected MIME type', { type: file.type })
    return NextResponse.json({ error: 'File must be an image or video' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 100 MB limit' }, { status: 400 })
  }

  const ext = MIME_TO_EXT[file.type] ?? file.name.split('.').pop()?.toLowerCase() ?? 'bin'

  try {
    const blob = await put(`sends/${crypto.randomUUID()}.${ext}`, file, {
      access: 'public',
      contentType: file.type, // safe — validated against whitelist above
    })
    log('INFO', 'upload: completed', { url: blob.url })
    return NextResponse.json({ photoUrl: blob.url })
  } catch (err) {
    log('ERROR', 'upload: blob put failed', { error: String(err) })
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

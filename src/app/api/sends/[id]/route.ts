import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { attachPhoto, deleteSend } from '@/services/sendService'
import { log } from '@/lib/logger'

const PatchSchema = z.object({
  userId:   z.string().uuid(),
  photoUrl: z.string().url(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    log('WARN', 'attachPhoto: invalid JSON body', { id })
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    log('WARN', 'attachPhoto: validation failed', { id, issues: parsed.error.issues })
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
  }

  const result = await attachPhoto(id, parsed.data.userId, parsed.data.photoUrl)
  if (result === 'not_found') {
    log('WARN', 'attachPhoto: send not found or not owned by user', { id })
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  log('INFO', 'attachPhoto: completed', { id })
  return NextResponse.json({ status: 'success' })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = request.nextUrl.searchParams.get('userId')
  const parsed = z.string().uuid().safeParse(userId)
  if (!parsed.success) {
    log('WARN', 'deleteSend: invalid userId', { id })
    return NextResponse.json({ error: 'Valid userId required' }, { status: 400 })
  }

  const result = await deleteSend(id, parsed.data)
  if (result === 'not_found') {
    log('WARN', 'deleteSend: send not found or not owned by user', { id })
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  log('INFO', 'deleteSend: completed', { id })
  return new NextResponse(null, { status: 204 })
}

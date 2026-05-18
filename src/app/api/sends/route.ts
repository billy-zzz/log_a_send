import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BoulderingSendSchema } from '@/lib/types'
import { logSend, getRecentSends } from '@/services/sendService'
import { log } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const parsed = z.string().uuid().safeParse(userId)
  if (!parsed.success) {
    log('WARN', 'getSends: invalid userId', { userId: userId ?? undefined })
    return NextResponse.json({ error: 'Valid userId required' }, { status: 400 })
  }

  const sends = await getRecentSends(parsed.data)
  log('INFO', 'getSends: completed', { userId: parsed.data, count: sends.length })
  return NextResponse.json({ sends })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    log('WARN', 'logSend: invalid JSON body')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BoulderingSendSchema.safeParse(body)
  if (!parsed.success) {
    log('WARN', 'logSend: validation failed', { issues: parsed.error.issues })
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
  }

  const result = await logSend(parsed.data)
  log('INFO', 'logSend: completed', { status: result.status, userId: parsed.data.userId })

  if (result.status === 'duplicate') return NextResponse.json(result)
  if (result.status === 'error') return NextResponse.json(result, { status: 500 })
  return NextResponse.json(result, { status: 201 })
}

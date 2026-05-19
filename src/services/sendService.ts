import { del } from '@vercel/blob'
import { db } from '@/lib/db'
import { log } from '@/lib/logger'
import { BoulderingSend, GradeScale, SendRecord, SendResult } from '@/lib/types'
import { Prisma } from '@prisma/client'

export async function logSend(send: BoulderingSend): Promise<SendResult> {
  try {
    const record = await db.send.create({
      data: {
        userId:         send.userId,
        gymId:          send.gymId,
        scale:          send.scale,
        grade:          send.grade,
        score:          send.score,
        attempts:       send.attempts,
        photoUrl:       send.photoUrl,
        notes:          send.notes,
        sentAt:         new Date(send.sentAt),
        idempotencyKey: send.idempotencyKey,
      },
    })
    return { status: 'success', send: { ...send, id: record.id } }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const existing = await db.send.findUnique({ where: { idempotencyKey: send.idempotencyKey } })
      return { status: 'duplicate', id: existing?.id ?? 'unknown' }
    }
    throw err
  }
}

export async function attachPhoto(
  id: string,
  userId: string,
  photoUrl: string,
): Promise<'success' | 'not_found'> {
  // updateMany allows a compound WHERE — atomically checks ownership without a separate read
  const result = await db.send.updateMany({
    where: { id, userId },
    data:  { photoUrl },
  })
  return result.count > 0 ? 'success' : 'not_found'
}

export async function deleteSend(id: string, userId: string): Promise<'deleted' | 'not_found'> {
  const send = await db.send.findFirst({ where: { id, userId }, select: { photoUrl: true } })
  if (!send) return 'not_found'
  await db.send.delete({ where: { id } })
  if (send.photoUrl) {
    try {
      await del(send.photoUrl)
    } catch (err) {
      log('WARN', 'deleteSend: blob delete failed', { id, error: String(err) })
    }
  }
  return 'deleted'
}

export async function getAllSends(userId: string): Promise<SendRecord[]> {
  const sends = await db.send.findMany({
    where: { userId },
    orderBy: { sentAt: 'desc' },
  })

  return sends.map((s) => ({
    id:       s.id,
    userId:   s.userId,
    gymId:    s.gymId,
    scale:    s.scale as GradeScale,
    grade:    s.grade,
    score:    s.score,
    attempts: s.attempts,
    photoUrl: s.photoUrl,
    notes:    s.notes,
    sentAt:   s.sentAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }))
}

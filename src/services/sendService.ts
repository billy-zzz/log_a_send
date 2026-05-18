import { db } from '@/lib/db'
import { BoulderingSend, GradeScale, SendRecord, SendResult } from '@/lib/types'
import { Prisma } from '@prisma/client'

function idempotencyKey(send: BoulderingSend): string {
  const minute = send.sentAt.slice(0, 16) // "2025-01-01T12:34"
  return `${send.userId}#${send.gymId}#${send.grade}#${minute}`
}

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
        idempotencyKey: idempotencyKey(send),
      },
    })
    return { status: 'success', send: { ...send, id: record.id } }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const existing = await db.send.findUnique({ where: { idempotencyKey: idempotencyKey(send) } })
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

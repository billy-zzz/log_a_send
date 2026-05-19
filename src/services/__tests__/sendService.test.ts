import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate, mockFindUnique, mockFindMany, mockUpdateMany } = vi.hoisted(() => ({
  mockCreate:     vi.fn(),
  mockFindUnique: vi.fn(),
  mockFindMany:   vi.fn(),
  mockUpdateMany: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    send: {
      create:     mockCreate,
      findUnique: mockFindUnique,
      findMany:   mockFindMany,
      updateMany: mockUpdateMany,
    },
  },
}))

import { logSend, attachPhoto, getAllSends } from '../sendService'
import type { BoulderingSend } from '@/lib/types'

beforeEach(() => vi.resetAllMocks())

const validSend: BoulderingSend = {
  userId:         '550e8400-e29b-41d4-a716-446655440000',
  gymId:          'boulder-co-westgate',
  scale:          'V',
  grade:          'V6',
  score:          6,
  attempts:       5,
  sentAt:         new Date().toISOString(),
  idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
}

describe('logSend', () => {
  it('returns success and the new id for a new send', async () => {
    mockCreate.mockResolvedValue({ id: 'cuid-123' })

    const result = await logSend(validSend)

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.send.id).toBe('cuid-123')
      expect(result.send.grade).toBe('V6')
    }
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  it('returns duplicate when idempotency key already exists', async () => {
    const { Prisma } = await import('@prisma/client')
    const uniqueError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '6.0.0',
      meta: { target: ['idempotencyKey'] },
    })
    mockCreate.mockRejectedValue(uniqueError)
    mockFindUnique.mockResolvedValue({ id: 'existing-123' })

    const result = await logSend(validSend)

    expect(result.status).toBe('duplicate')
    if (result.status === 'duplicate') {
      expect(result.id).toBe('existing-123')
    }
  })

  it('rethrows unexpected errors', async () => {
    mockCreate.mockRejectedValue(new Error('Connection lost'))
    await expect(logSend(validSend)).rejects.toThrow('Connection lost')
  })
})

describe('attachPhoto', () => {
  it('returns success when the send exists and belongs to the user', async () => {
    mockUpdateMany.mockResolvedValue({ count: 1 })

    const result = await attachPhoto('send-abc', validSend.userId, 'https://example.com/photo.jpg')

    expect(result).toBe('success')
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: 'send-abc', userId: validSend.userId },
      data:  { photoUrl: 'https://example.com/photo.jpg' },
    })
  })

  it('returns not_found when no rows were updated (wrong owner or missing send)', async () => {
    mockUpdateMany.mockResolvedValue({ count: 0 })

    const result = await attachPhoto('send-abc', 'other-user-uuid', 'https://example.com/photo.jpg')

    expect(result).toBe('not_found')
  })
})

describe('getAllSends', () => {
  it('returns all sends mapped to SendRecord shape', async () => {
    const now = new Date()
    mockFindMany.mockResolvedValue([{
      id: 'cuid-1', userId: validSend.userId, gymId: validSend.gymId,
      scale: 'V', grade: 'V6', score: 6, attempts: 5,
      photoUrl: null, notes: null, sentAt: now, createdAt: now,
      idempotencyKey: 'key',
    }])

    const result = await getAllSends(validSend.userId)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cuid-1')
    expect(result[0].sentAt).toBe(now.toISOString())
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: validSend.userId } })
    )
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockLogSend, mockGetAllSends } = vi.hoisted(() => ({
  mockLogSend:     vi.fn(),
  mockGetAllSends: vi.fn(),
}))

vi.mock('@/services/sendService', () => ({
  logSend:   mockLogSend,
  getAllSends: mockGetAllSends,
}))

vi.mock('@/lib/logger', () => ({ log: vi.fn() }))

import { GET, POST } from '../route'
import type { BoulderingSend } from '@/lib/types'

beforeEach(() => vi.resetAllMocks())

const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

const validBody: BoulderingSend = {
  userId:         VALID_USER_ID,
  gymId:          'boulder-co-westgate',
  scale:          'V',
  grade:          'V6',
  score:          6,
  attempts:       3,
  sentAt:         new Date().toISOString(),
  idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
}

// ─── GET /api/sends ───────────────────────────────────────────────────────────

describe('GET /api/sends', () => {
  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest('http://localhost/api/sends')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for a non-UUID userId', async () => {
    const req = new NextRequest('http://localhost/api/sends?userId=not-a-uuid')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 with sends array for a valid userId', async () => {
    mockGetAllSends.mockResolvedValue([])
    const req = new NextRequest(`http://localhost/api/sends?userId=${VALID_USER_ID}`)
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.sends).toEqual([])
    expect(mockGetAllSends).toHaveBeenCalledWith(VALID_USER_ID)
  })
})

// ─── POST /api/sends ──────────────────────────────────────────────────────────

describe('POST /api/sends', () => {
  it('returns 400 for invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/sends', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 422 for a body that fails schema validation', async () => {
    const req = new NextRequest('http://localhost/api/sends', {
      method: 'POST',
      body: JSON.stringify({ userId: 'bad', gymId: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(422)
  })

  it('returns 201 for a successful new send', async () => {
    mockLogSend.mockResolvedValue({ status: 'success', send: { ...validBody, id: 'new-id' } })
    const req = new NextRequest('http://localhost/api/sends', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(mockLogSend).toHaveBeenCalledTimes(1)
  })

  it('returns 200 for a duplicate send', async () => {
    mockLogSend.mockResolvedValue({ status: 'duplicate', id: 'existing-id' })
    const req = new NextRequest('http://localhost/api/sends', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe('existing-id')
  })
})

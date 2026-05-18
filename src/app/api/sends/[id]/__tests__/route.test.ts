import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockAttachPhoto } = vi.hoisted(() => ({
  mockAttachPhoto: vi.fn(),
}))

vi.mock('@/services/sendService', () => ({
  attachPhoto: mockAttachPhoto,
}))

vi.mock('@/lib/logger', () => ({ log: vi.fn() }))

import { PATCH } from '../route'

beforeEach(() => vi.resetAllMocks())

const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440000'
const params = Promise.resolve({ id: 'send-123' })

describe('PATCH /api/sends/[id]', () => {
  it('returns 400 for invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/sends/send-123', {
      method: 'PATCH',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(400)
  })

  it('returns 422 when photoUrl is missing', async () => {
    const req = new NextRequest('http://localhost/api/sends/send-123', {
      method: 'PATCH',
      body: JSON.stringify({ userId: VALID_USER_ID }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(422)
  })

  it('returns 422 when userId is not a valid UUID', async () => {
    const req = new NextRequest('http://localhost/api/sends/send-123', {
      method: 'PATCH',
      body: JSON.stringify({ userId: 'not-a-uuid', photoUrl: 'https://example.com/photo.jpg' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(422)
  })

  it('returns 404 when the send does not belong to the user', async () => {
    mockAttachPhoto.mockResolvedValue('not_found')
    const req = new NextRequest('http://localhost/api/sends/send-123', {
      method: 'PATCH',
      body: JSON.stringify({ userId: VALID_USER_ID, photoUrl: 'https://example.com/photo.jpg' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(404)
  })

  it('returns 200 and calls attachPhoto with the correct args', async () => {
    mockAttachPhoto.mockResolvedValue('success')
    const req = new NextRequest('http://localhost/api/sends/send-123', {
      method: 'PATCH',
      body: JSON.stringify({ userId: VALID_USER_ID, photoUrl: 'https://example.com/photo.jpg' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params })
    expect(res.status).toBe(200)
    expect(mockAttachPhoto).toHaveBeenCalledWith('send-123', VALID_USER_ID, 'https://example.com/photo.jpg')
  })
})

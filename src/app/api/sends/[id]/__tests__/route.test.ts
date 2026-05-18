import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockAttachPhoto, mockDeleteSend } = vi.hoisted(() => ({
  mockAttachPhoto: vi.fn(),
  mockDeleteSend:  vi.fn(),
}))

vi.mock('@/services/sendService', () => ({
  attachPhoto: mockAttachPhoto,
  deleteSend:  mockDeleteSend,
}))

vi.mock('@/lib/logger', () => ({ log: vi.fn() }))

import { PATCH, DELETE } from '../route'

beforeEach(() => vi.resetAllMocks())

const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440000'
const params = Promise.resolve({ id: 'send-123' })

// ─── PATCH /api/sends/[id] ────────────────────────────────────────────────────

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

// ─── DELETE /api/sends/[id] ───────────────────────────────────────────────────

describe('DELETE /api/sends/[id]', () => {
  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest('http://localhost/api/sends/send-123', { method: 'DELETE' })
    const res = await DELETE(req, { params })
    expect(res.status).toBe(400)
  })

  it('returns 400 when userId is not a valid UUID', async () => {
    const req = new NextRequest('http://localhost/api/sends/send-123?userId=not-a-uuid', { method: 'DELETE' })
    const res = await DELETE(req, { params })
    expect(res.status).toBe(400)
  })

  it('returns 404 when the send does not belong to the user', async () => {
    mockDeleteSend.mockResolvedValue('not_found')
    const req = new NextRequest(`http://localhost/api/sends/send-123?userId=${VALID_USER_ID}`, { method: 'DELETE' })
    const res = await DELETE(req, { params })
    expect(res.status).toBe(404)
  })

  it('returns 204 and calls deleteSend with the correct args', async () => {
    mockDeleteSend.mockResolvedValue('deleted')
    const req = new NextRequest(`http://localhost/api/sends/send-123?userId=${VALID_USER_ID}`, { method: 'DELETE' })
    const res = await DELETE(req, { params })
    expect(res.status).toBe(204)
    expect(mockDeleteSend).toHaveBeenCalledWith('send-123', VALID_USER_ID)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockHandleUpload } = vi.hoisted(() => ({ mockHandleUpload: vi.fn() }))

vi.mock('@vercel/blob/client', () => ({ handleUpload: mockHandleUpload }))
vi.mock('@/lib/logger', () => ({ log: vi.fn() }))

import { POST } from '../route'

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token')
})

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/upload', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/upload', () => {
  it('returns 503 when BLOB_READ_WRITE_TOKEN is not set', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '')
    const req = makeRequest({ type: 'blob.generate-client-token', pathname: 'sends/test.jpg' })
    const res = await POST(req)
    expect(res.status).toBe(503)
    expect(mockHandleUpload).not.toHaveBeenCalled()
  })

  it('delegates to handleUpload and returns its response', async () => {
    mockHandleUpload.mockResolvedValue({ clientToken: 'abc123' })
    const req = makeRequest({ type: 'blob.generate-client-token', pathname: 'sends/test.jpg' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ clientToken: 'abc123' })
    expect(mockHandleUpload).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when handleUpload throws', async () => {
    mockHandleUpload.mockRejectedValue(new Error('Invalid token'))
    const req = makeRequest({ type: 'blob.upload-completed', blob: { url: 'https://example.com/file.jpg' } })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

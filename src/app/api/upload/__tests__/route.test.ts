import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockPut } = vi.hoisted(() => ({ mockPut: vi.fn() }))

vi.mock('@vercel/blob', () => ({ put: mockPut }))
vi.mock('@/lib/logger', () => ({ log: vi.fn() }))

import { POST } from '../route'

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token')
})

function makeRequest(file: File): NextRequest {
  const formData = new FormData()
  formData.append('file', file)
  return new NextRequest('http://localhost/api/upload', { method: 'POST', body: formData })
}

describe('POST /api/upload', () => {
  it('returns photoUrl null when BLOB token is not set', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '')
    const req = makeRequest(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect((await res.json()).photoUrl).toBeNull()
    expect(mockPut).not.toHaveBeenCalled()
  })

  it('returns 400 when no file is provided', async () => {
    const req = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: new FormData(),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for a disallowed MIME type', async () => {
    const req = makeRequest(new File(['x'], 'doc.pdf', { type: 'application/pdf' }))
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when file exceeds 100 MB', async () => {
    // File.size is read-only in jsdom; stub the formData to return a file-like object with a large size
    const oversizedFile = { name: 'big.mp4', type: 'video/mp4', size: 101 * 1024 * 1024 }
    const formData = new FormData()
    vi.spyOn(formData, 'get').mockReturnValue(oversizedFile as unknown as File)
    const req = new NextRequest('http://localhost/api/upload', { method: 'POST', body: formData })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('uploads and returns photoUrl for a valid image', async () => {
    mockPut.mockResolvedValue({ url: 'https://blob.example.com/photo.jpg' })
    const req = makeRequest(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.photoUrl).toBe('https://blob.example.com/photo.jpg')
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  it('uploads and returns photoUrl for a valid video', async () => {
    mockPut.mockResolvedValue({ url: 'https://blob.example.com/video.mp4' })
    const req = makeRequest(new File(['x'], 'clip.mp4', { type: 'video/mp4' }))
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect((await res.json()).photoUrl).toBe('https://blob.example.com/video.mp4')
  })
})

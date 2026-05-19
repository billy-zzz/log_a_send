'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { upload } from '@vercel/blob/client'
import { useQueryClient } from '@tanstack/react-query'
import { USER_ID } from '@/user'

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/heic': 'heic', 'image/heif': 'heif',
  'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
  'video/x-m4v': 'm4v', 'video/3gpp': '3gp', 'video/3gpp2': '3g2',
}

interface PostSendSheetProps {
  sendId: string
  grade: string
  onDone: () => void
}

type State = 'idle' | 'uploading' | 'error'

async function uploadAndAttach(file: File, sendId: string): Promise<void> {
  const ext = MIME_TO_EXT[file.type] ?? file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const blob = await upload(`sends/${crypto.randomUUID()}.${ext}`, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  })

  const patchRes = await fetch(`/api/sends/${sendId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER_ID, photoUrl: blob.url }),
  })
  if (!patchRes.ok) throw new Error('Failed to attach photo')
}

export function PostSendSheet({ sendId, grade, onDone }: PostSendSheetProps) {
  const [state, setState] = useState<State>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  async function processFile(file: File) {
    setState('uploading')
    try {
      await uploadAndAttach(file, sendId)
      await queryClient.invalidateQueries({ queryKey: ['sends', USER_ID] })
      onDone()
    } catch {
      setState('error')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) processFile(file)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={state === 'uploading' ? undefined : onDone}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          className="w-full max-w-[480px] bg-neutral-900 rounded-t-3xl px-6 pt-5 pb-10 pointer-events-auto"
        >
          <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-7" />

          <div className="text-center mb-8">
            <span className="font-display text-8xl font-black text-orange-500 leading-none">{grade}</span>
            <p className="text-white font-semibold text-xl mt-3">That&apos;s a send!</p>
            <p className="text-neutral-400 text-sm mt-1">Want to add a photo or video?</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleChange}
            className="hidden"
          />

          {state === 'error' && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl px-4 py-3 mb-4">
              Upload failed — try again or skip.
            </p>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={state === 'uploading'}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
            >
              {state === 'uploading' ? 'Uploading...' : 'Add Photo or Video'}
            </button>
            <button
              onClick={onDone}
              disabled={state === 'uploading'}
              className="w-full py-3 text-neutral-400 font-semibold text-sm hover:text-neutral-300 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

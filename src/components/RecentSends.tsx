'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
import type { SendRecord } from '@/lib/types'
import { getGymName } from '@/lib/gyms'
import { Trash2 } from 'lucide-react'
import { MountainIcon } from './icons'

async function fetchSends(userId: string): Promise<SendRecord[]> {
  const res = await fetch(`/api/sends?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) throw new Error('Failed to load sends')
  return (await res.json()).sends
}

async function deleteSendRequest(id: string, userId: string): Promise<void> {
  const res = await fetch(`/api/sends/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
}

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|m4v|avi|3gp|3g2)(\?.*)?$/i.test(url)
}

function gradeAccentColor(score: number): string {
  if (score <= 3) return 'bg-green-500'
  if (score <= 7) return 'bg-yellow-400'
  if (score <= 11) return 'bg-orange-500'
  return 'bg-red-500'
}

function getDateLabel(isoString: string): string {
  const sendDate = new Date(isoString)
  sendDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (sendDate.getTime() === today.getTime()) return 'Today'
  if (sendDate.getTime() === yesterday.getTime()) return 'Yesterday'

  const d = String(sendDate.getDate()).padStart(2, '0')
  const m = String(sendDate.getMonth() + 1).padStart(2, '0')
  const y = String(sendDate.getFullYear()).slice(2)
  return `${d}/${m}/${y}`
}

function groupSendsByDate(sends: SendRecord[]): { label: string; sends: SendRecord[] }[] {
  const groups = new Map<string, SendRecord[]>()
  for (const send of sends) {
    const label = getDateLabel(send.sentAt)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(send)
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, sends: items }))
}

function MediaModal({ url, onClose }: { url: string; onClose: () => void }) {
  const video = isVideo(url)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white"
        >
          <X size={20} />
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          {video
            ? <video src={url} controls autoPlay playsInline className="max-w-full max-h-[85vh] rounded-xl" />
            : <img src={url} alt="Send media" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
          }
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const REVEAL_W = 72

function SwipeToDelete({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  const x = useMotionValue(0)

  function handleDragEnd() {
    animate(x, x.get() < -(REVEAL_W / 2) ? -REVEAL_W : 0, {
      type: 'spring', stiffness: 500, damping: 40,
    })
  }

  function handleDelete() {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    onDelete()
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div
        className="absolute right-0 inset-y-0 bg-red-500 flex items-center justify-center"
        style={{ width: REVEAL_W }}
      >
        <button
          onClick={handleDelete}
          className="w-full h-full flex items-center justify-center text-white"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <motion.div
        className="relative z-10"
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -REVEAL_W, right: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function RecentSends({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const [viewingUrl, setViewingUrl] = useState<string | null>(null)

  const { data: sends, isLoading, isError } = useQuery<SendRecord[]>({
    queryKey: ['sends', userId],
    queryFn: () => fetchSends(userId),
  })

  const { mutate: deleteSend } = useMutation({
    mutationFn: (id: string) => deleteSendRequest(id, userId),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['sends', userId] })
      const prev = queryClient.getQueryData<SendRecord[]>(['sends', userId])
      queryClient.setQueryData<SendRecord[]>(['sends', userId], old => old?.filter(s => s.id !== id) ?? [])
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['sends', userId], ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sends', userId] })
    },
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
      Loading...
    </div>
  )

  if (isError) return (
    <div className="text-red-400 text-sm text-center py-8">Failed to load sends.</div>
  )

  if (!sends?.length) return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
        <MountainIcon width={13} height={12} className="text-neutral-600" />
      </div>
      <div>
        <p className="text-white font-semibold">Nothing logged yet</p>
        <p className="text-neutral-500 text-sm mt-1">Get on the wall and log your first send!</p>
      </div>
    </div>
  )

  const groups = groupSendsByDate(sends)

  return (
    <>
      <div className="h-full overflow-y-auto flex flex-col gap-6">
        {groups.map(({ label, sends: groupSends }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">{label}</p>
              <span className="text-xs font-bold text-orange-500 bg-orange-500/10 rounded-full px-2 py-0.5">
                {groupSends.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {groupSends.map((send) => {
                const gymName = getGymName(send.gymId)
                return (
                  <SwipeToDelete key={send.id} onDelete={() => deleteSend(send.id)}>
                    <div className="bg-neutral-800 flex items-stretch">
                      <div className={`w-1 shrink-0 ${gradeAccentColor(send.score)}`} />
                      <div className="flex-1 p-4 flex gap-4 items-start">
                        {send.photoUrl && (
                          <button
                            onClick={() => setViewingUrl(send.photoUrl!)}
                            className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 flex-shrink-0"
                          >
                            {isVideo(send.photoUrl)
                              ? <>
                                  <video src={send.photoUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Play size={18} className="text-white fill-white" />
                                  </div>
                                </>
                              : <Image src={send.photoUrl} alt={`${send.grade} send`} width={56} height={56} className="w-full h-full object-cover" />
                            }
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-display text-2xl font-black text-white leading-none">{send.grade}</span>
                            <span className="text-xs text-neutral-500 px-2 py-0.5 bg-neutral-700 rounded-full">
                              {send.scale === 'V' ? 'V Scale' : 'Font'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mb-1 truncate">{gymName}</p>
                          <p className="text-xs text-neutral-400">
                            {send.attempts} attempt{send.attempts !== 1 ? 's' : ''}
                          </p>
                          {send.notes && (
                            <p className="text-xs text-neutral-500 mt-1 truncate">{send.notes}</p>
                          )}
                        </div>
                        <span className="text-xs text-neutral-600 shrink-0 pt-0.5">
                          {new Date(send.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </SwipeToDelete>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {viewingUrl && <MediaModal url={viewingUrl} onClose={() => setViewingUrl(null)} />}
    </>
  )
}

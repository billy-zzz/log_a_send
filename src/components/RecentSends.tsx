'use client'

import { useQuery } from '@tanstack/react-query'
import type { SendRecord } from '@/lib/types'
import { getGymName } from '@/lib/gyms'

async function fetchSends(userId: string): Promise<SendRecord[]> {
  const res = await fetch(`/api/sends?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) throw new Error('Failed to load sends')
  return (await res.json()).sends
}

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|m4v|avi)(\?.*)?$/i.test(url)
}

function gradeAccentColor(score: number): string {
  if (score <= 3) return 'bg-green-500'
  if (score <= 7) return 'bg-yellow-400'
  if (score <= 11) return 'bg-orange-500'
  return 'bg-red-500'
}

function MountainIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="currentColor" className="text-neutral-600">
      <path d="M10 0L20 18H0L10 0Z" />
    </svg>
  )
}

export function RecentSends({ userId }: { userId: string }) {
  const { data: sends, isLoading, isError } = useQuery<SendRecord[]>({
    queryKey: ['sends', userId],
    queryFn: () => fetchSends(userId),
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
        <MountainIcon />
      </div>
      <div>
        <p className="text-white font-semibold">Nothing logged yet</p>
        <p className="text-neutral-500 text-sm mt-1">Get on the wall and log your first send!</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Today&apos;s Sends</p>
        <span className="text-xs font-bold text-orange-500 bg-orange-500/10 rounded-full px-2 py-0.5">
          {sends.length}
        </span>
      </div>
      {sends.map((send) => {
        const gymName = getGymName(send.gymId)
        return (
        <div key={send.id} className="bg-neutral-800 rounded-2xl flex items-stretch overflow-hidden">
          <div className={`w-1 flex-shrink-0 ${gradeAccentColor(send.score)}`} />
          <div className="flex-1 p-4 flex gap-4 items-start">
            {send.photoUrl && (
              isVideo(send.photoUrl)
                ? <video src={send.photoUrl} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" muted playsInline preload="metadata" />
                : <img src={send.photoUrl} alt="Send" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
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
            <span className="text-xs text-neutral-600 flex-shrink-0 pt-0.5">
              {new Date(send.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )})}
    </div>
  )
}

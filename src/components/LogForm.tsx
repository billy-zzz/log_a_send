'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BoulderingSendSchema, BoulderingSend, GradeScale, SendRecord, V_GRADES, FONT_GRADES } from '@/lib/types'
import { GradePicker } from './GradePicker'
import { GymPicker } from './GymPicker'
import { PostSendSheet } from './PostSendSheet'
import { USER_ID, getLastGymId, setLastGymId } from '@/user'
import type { Gym } from '@/lib/gyms'

const GRADE_LIST = { V: V_GRADES, Font: FONT_GRADES }

type PostSendResult =
  | { status: 'success'; send: { id: string } }
  | { status: 'duplicate'; id: string }

async function postSend(payload: BoulderingSend): Promise<PostSendResult> {
  const res = await fetch('/api/sends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<PostSendResult>
}

export function LogForm({ onSuccess }: { onSuccess?: () => void }) {
  const [gymId, setGymId]           = useState<string | null>(() => getLastGymId())
  const [scale, setScale]           = useState<GradeScale>('V')
  const [grade, setGrade]           = useState(V_GRADES[0].grade)
  const [score, setScore]           = useState(V_GRADES[0].score)
  const [attempts, setAttempts]     = useState(1)
  const [attemptsInput, setAttemptsInput] = useState('1')
  const [notes, setNotes]           = useState('')
  const [loggedSend, setLoggedSend] = useState<{ id: string; grade: string } | null>(null)
  const [error, setError]           = useState<string | null>(null)

  function handleGymChange(gym: Gym) {
    setGymId(gym.id)
    setLastGymId(gym.id)
  }
  const queryClient = useQueryClient()

  function changeScale(s: GradeScale) {
    setScale(s)
    setGrade(GRADE_LIST[s][0].grade)
    setScore(GRADE_LIST[s][0].score)
  }

  function adjustAttempts(delta: number) {
    const next = Math.max(1, Math.min(999, attempts + delta))
    setAttempts(next)
    setAttemptsInput(String(next))
  }

  function handleAttemptsInput(val: string) {
    setAttemptsInput(val)
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 1) setAttempts(Math.min(999, n))
  }

  function handleAttemptsBlur() {
    const n = parseInt(attemptsInput, 10)
    const clamped = isNaN(n) || n < 1 ? 1 : Math.min(999, n)
    setAttempts(clamped)
    setAttemptsInput(String(clamped))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: postSend,
    onMutate: async (newSend) => {
      await queryClient.cancelQueries({ queryKey: ['sends', USER_ID] })
      const snapshot = queryClient.getQueryData<SendRecord[]>(['sends', USER_ID])
      queryClient.setQueryData<SendRecord[]>(['sends', USER_ID], (old) => [
        { ...newSend, id: `optimistic-${Date.now()}`, createdAt: new Date().toISOString() },
        ...(old ?? []),
      ])
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['sends', USER_ID], context?.snapshot)
      setError('Send failed — rolled back. Try again.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['sends', USER_ID] }),
    onSuccess: (data) => {
      const id = data.status === 'success' ? data.send.id : data.id
      setAttempts(1)
      setAttemptsInput('1')
      setNotes('')
      setError(null)
      setLoggedSend({ id, grade })
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!gymId) { setError('Please select a gym before logging a send.'); return }
    const result = BoulderingSendSchema.safeParse({
      userId: USER_ID, gymId, scale, grade, score,
      attempts, notes: notes || undefined,
      sentAt: new Date().toISOString(),
    })
    if (!result.success) { setError(result.error.issues[0]?.message ?? 'Invalid'); return }
    mutate(result.data)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Gym */}
        <GymPicker selectedGymId={gymId} onChange={handleGymChange} />

        {/* Scale toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Scale</label>
          <div className="relative flex bg-neutral-800 rounded-xl p-1">
            <div
              className="absolute top-1 bottom-1 bg-neutral-600 rounded-lg transition-all duration-200 ease-out"
              style={{
                left: scale === 'V' ? '4px' : '50%',
                right: scale === 'V' ? '50%' : '4px',
              }}
            />
            {(['V', 'Font'] as GradeScale[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeScale(s)}
                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors rounded-lg ${
                  scale === s ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                {s === 'V' ? 'V Scale' : 'Font Scale'}
              </button>
            ))}
          </div>
        </div>

        {/* Grade */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Grade</label>
          <div className="text-center py-2">
            <span className="font-display text-7xl font-black text-white leading-none">{grade}</span>
          </div>
          <GradePicker grades={GRADE_LIST[scale]} onChange={(g, s) => { setGrade(g); setScore(s) }} />
        </div>

        {/* Attempts */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Attempts</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustAttempts(-1)}
              disabled={attempts <= 1}
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-bold flex items-center justify-center transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={attemptsInput}
              onChange={(e) => handleAttemptsInput(e.target.value)}
              onBlur={handleAttemptsBlur}
              className="flex-1 text-center bg-neutral-800 rounded-xl py-2.5 text-white font-display text-3xl font-black focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums"
            />
            <button
              type="button"
              onClick={() => adjustAttempts(1)}
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-bold flex items-center justify-center transition-colors active:scale-95 flex-shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Beta, conditions, how it felt..."
            className="bg-neutral-800 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          {isPending ? 'Logging...' : 'Log Send'}
        </button>
      </form>

      {loggedSend && (
        <PostSendSheet
          sendId={loggedSend.id}
          grade={loggedSend.grade}
          onDone={() => { setLoggedSend(null); onSuccess?.() }}
        />
      )}
    </>
  )
}

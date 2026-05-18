'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { filterGyms, getGymById, type Gym } from '@/lib/gyms'

interface GymPickerProps {
  selectedGymId: string | null
  onChange: (gym: Gym) => void
}

function selectedGymName(gymId: string | null): string | null {
  if (!gymId) return null
  if (gymId.startsWith('custom:')) return gymId.slice(7)
  return getGymById(gymId)?.name ?? gymId
}

export function GymPicker({ selectedGymId, onChange }: GymPickerProps) {
  const [open, setOpen]               = useState(false)
  const [query, setQuery]             = useState('')
  const [customMode, setCustomMode]   = useState(false)
  const [customName, setCustomName]   = useState('')
  const searchRef  = useRef<HTMLInputElement>(null)
  const customRef  = useRef<HTMLInputElement>(null)

  const results = filterGyms(query)
  const displayName = selectedGymName(selectedGymId)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setCustomMode(false)
    setCustomName('')
    setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    if (customMode) setTimeout(() => customRef.current?.focus(), 50)
  }, [customMode])

  function select(gym: Gym) {
    onChange(gym)
    setOpen(false)
  }

  function confirmCustom() {
    const name = customName.trim()
    if (!name) return
    select({ id: `custom:${name}`, name, city: '', country: 'NZ' })
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Gym</label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between bg-neutral-800 rounded-xl px-4 py-3 text-left transition-colors hover:bg-neutral-700"
        >
          <span className={displayName ? 'text-white text-sm font-medium' : 'text-neutral-500 text-sm'}>
            {displayName ?? 'Select a gym'}
          </span>
          <span className="text-neutral-500 text-xs ml-2">▾</span>
        </button>
      </div>

      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="w-full max-w-[480px] bg-neutral-900 rounded-t-3xl pointer-events-auto flex flex-col"
              style={{ maxHeight: '70vh' }}
            >
              <div className="px-6 pt-5 pb-4 flex-shrink-0">
                <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-5" />

                {customMode ? (
                  <div className="flex gap-2">
                    <input
                      ref={customRef}
                      type="text"
                      placeholder="Gym name..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmCustom()}
                      className="flex-1 bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={confirmCustom}
                      disabled={!customName.trim()}
                      className="px-4 py-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search gyms..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                )}
              </div>

              <div className="overflow-y-auto pb-6 px-6 flex flex-col gap-1">
                {!customMode && (
                  <>
                    {results.length === 0 && (
                      <p className="text-neutral-500 text-sm text-center py-6">No gyms found</p>
                    )}
                    {results.map((gym) => (
                      <button
                        key={gym.id}
                        type="button"
                        onClick={() => select(gym)}
                        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                          gym.id === selectedGymId
                            ? 'bg-orange-500/15 text-orange-400'
                            : 'hover:bg-neutral-800 text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{gym.name}</span>
                        <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">{gym.city}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCustomMode(true)}
                      className="w-full flex items-center gap-2 rounded-xl px-4 py-3 text-left text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mt-2 border-t border-neutral-800 pt-4"
                    >
                      <span className="text-sm">My gym isn&apos;t listed</span>
                      <span className="text-xs text-neutral-600">→</span>
                    </button>
                  </>
                )}

                {customMode && (
                  <button
                    type="button"
                    onClick={() => setCustomMode(false)}
                    className="w-full text-left px-4 py-3 text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
                  >
                    ← Back to list
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  )
}

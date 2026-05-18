'use client'

import { useState } from 'react'
import { MobileContainer } from './MobileContainer'
import { LogForm } from './LogForm'
import { RecentSends } from './RecentSends'
import { USER_ID } from '@/user'

type Tab = 'log' | 'sends'

export function App() {
  const [tab, setTab] = useState<Tab>('log')

  return (
    <MobileContainer>
      <div className="relative flex bg-neutral-800 rounded-2xl p-1 mb-3 flex-shrink-0">
        <div
          className="absolute top-1 bottom-1 bg-orange-500 rounded-xl transition-all duration-300 ease-out"
          style={{
            left: tab === 'log' ? '4px' : '50%',
            right: tab === 'log' ? '50%' : '4px',
          }}
        />
        {(['log', 'sends'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative z-10 flex-1 py-3 text-sm font-semibold uppercase tracking-widest transition-colors ${
              tab === t ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            {t === 'log' ? 'Log' : 'Sends'}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        {tab === 'log'
          ? <LogForm onSuccess={() => setTab('sends')} />
          : <RecentSends userId={USER_ID} />
        }
      </div>
    </MobileContainer>
  )
}

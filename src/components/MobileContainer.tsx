import { ReactNode } from 'react'
import { MountainIcon } from './icons'

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="h-full bg-neutral-950 flex justify-center overflow-hidden">
      <div className="w-full max-w-[480px] flex flex-col bg-neutral-900 h-full shadow-2xl min-w-0">
        <header className="flex-shrink-0 flex items-center gap-2.5 px-5 pt-4 pb-3">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <MountainIcon />
          </div>
          <span className="font-display font-bold text-white text-sm" style={{ letterSpacing: '0.18em' }}>
            LOG A SEND
          </span>
        </header>
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden pb-4 px-4 pt-1">
          {children}
        </main>
      </div>
    </div>
  )
}

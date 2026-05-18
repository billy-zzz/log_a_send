import { ReactNode } from 'react'

function MountainIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="currentColor">
      <path d="M6.5 0L13 12H0L6.5 0Z" />
    </svg>
  )
}

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center">
      <div className="w-full max-w-[480px] flex flex-col bg-neutral-900 min-h-screen shadow-2xl">
        <header className="flex-shrink-0 flex items-center gap-2.5 px-5 pt-6 pb-4">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <MountainIcon />
          </div>
          <span className="font-display font-bold text-white text-sm" style={{ letterSpacing: '0.18em' }}>
            LOG A SEND
          </span>
        </header>
        <main className="flex-1 overflow-y-auto pb-20 px-4 pt-1">
          {children}
        </main>
      </div>
    </div>
  )
}

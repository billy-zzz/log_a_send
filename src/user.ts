// placeholder until real auth is added
export const USER_ID = (() => {
  if (typeof window === 'undefined') return ''
  const stored = localStorage.getItem('logasend_uid')
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem('logasend_uid', id)
  return id
})()

export function getLastGymId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('logasend_gym')
}

export function setLastGymId(id: string): void {
  localStorage.setItem('logasend_gym', id)
}

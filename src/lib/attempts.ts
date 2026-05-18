// Bounded so the input can't be coerced to NaN or to a number the server would reject.
export const MIN_ATTEMPTS = 1
export const MAX_ATTEMPTS = 999

export function clampAttempts(n: number): number {
  if (!Number.isFinite(n)) return MIN_ATTEMPTS
  if (n < MIN_ATTEMPTS) return MIN_ATTEMPTS
  if (n > MAX_ATTEMPTS) return MAX_ATTEMPTS
  return Math.floor(n)
}

export function parseAttemptsInput(raw: string): number | null {
  const n = parseInt(raw, 10)
  if (isNaN(n)) return null
  return clampAttempts(n)
}

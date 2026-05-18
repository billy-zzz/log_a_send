import { describe, it, expect } from 'vitest'
import { clampAttempts, parseAttemptsInput, MIN_ATTEMPTS, MAX_ATTEMPTS } from '../attempts'

describe('clampAttempts', () => {
  it('returns the value when it is in range', () => {
    expect(clampAttempts(5)).toBe(5)
  })

  it('clamps low values to MIN_ATTEMPTS', () => {
    expect(clampAttempts(0)).toBe(MIN_ATTEMPTS)
    expect(clampAttempts(-50)).toBe(MIN_ATTEMPTS)
  })

  it('clamps high values to MAX_ATTEMPTS', () => {
    expect(clampAttempts(1000)).toBe(MAX_ATTEMPTS)
    expect(clampAttempts(99999)).toBe(MAX_ATTEMPTS)
  })

  it('floors fractional values', () => {
    expect(clampAttempts(3.7)).toBe(3)
  })

  it('returns MIN_ATTEMPTS for non-finite numbers', () => {
    expect(clampAttempts(NaN)).toBe(MIN_ATTEMPTS)
    expect(clampAttempts(Infinity)).toBe(MIN_ATTEMPTS)
  })
})

describe('parseAttemptsInput', () => {
  it('parses a valid integer string', () => {
    expect(parseAttemptsInput('7')).toBe(7)
  })

  it('clamps a high integer string', () => {
    expect(parseAttemptsInput('5000')).toBe(MAX_ATTEMPTS)
  })

  it('returns null for empty input so the caller can decide whether to display the raw string', () => {
    expect(parseAttemptsInput('')).toBeNull()
  })

  it('returns null for non-numeric input', () => {
    expect(parseAttemptsInput('abc')).toBeNull()
  })

  it('parses the leading integer in mixed input', () => {
    expect(parseAttemptsInput('12abc')).toBe(12)
  })
})

import { describe, it, expect } from 'vitest'
import { filterGyms, getGymById, getGymName, GYMS } from '../gyms'

describe('filterGyms', () => {
  it('returns all gyms when query is empty', () => {
    expect(filterGyms('')).toHaveLength(GYMS.length)
  })

  it('returns all gyms when query is only whitespace', () => {
    expect(filterGyms('   ')).toHaveLength(GYMS.length)
  })

  it('filters by gym name', () => {
    const results = filterGyms('boulder co')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((g) => g.name.toLowerCase().includes('boulder co'))).toBe(true)
  })

  it('filters by city', () => {
    const results = filterGyms('wellington')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((g) => g.city === 'Wellington')).toBe(true)
  })

  it('is case insensitive', () => {
    expect(filterGyms('AUCKLAND')).toEqual(filterGyms('auckland'))
    expect(filterGyms('Boulder Co')).toEqual(filterGyms('boulder co'))
  })

  it('returns empty array when no gyms match', () => {
    expect(filterGyms('zzznomatch')).toHaveLength(0)
  })

  it('matches partial name or city', () => {
    const results = filterGyms('hang')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((g) =>
      g.name.toLowerCase().includes('hang') || g.city.toLowerCase().includes('hang')
    )).toBe(true)
  })
})

describe('getGymName', () => {
  it('returns the gym name for a known id', () => {
    expect(getGymName('uprising-christchurch')).toBe('Uprising Boulder Gym')
  })

  it('strips the custom: prefix for custom gyms', () => {
    expect(getGymName('custom:My Local Wall')).toBe('My Local Wall')
  })

  it('falls back to the raw id for unknown gyms', () => {
    expect(getGymName('unknown-gym-id')).toBe('unknown-gym-id')
  })
})

describe('getGymById', () => {
  it('returns the matching gym', () => {
    const gym = getGymById('boulder-co-westgate')
    expect(gym).toBeDefined()
    expect(gym?.name).toBe('Boulder Co Westgate')
  })

  it('returns undefined for unknown id', () => {
    expect(getGymById('not-a-real-gym')).toBeUndefined()
  })
})

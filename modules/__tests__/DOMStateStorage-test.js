import expect from 'expect'
import { saveState, readState } from '../DOMStateStorage'

describe('dom state storage', () => {
  it('saves and reads state data', () => {
    saveState('key1', { id: 1 })
    expect(readState('key1')).toEqual({ id: 1 })

    saveState('key1', null)
    expect(readState('key1')).toBe(undefined)

    saveState('key2', { id: 2 })
    expect(readState('key2')).toEqual({ id: 2 })

    expect(readState('key3')).toBe(undefined)
  })

  it('does not throw without sessionStorage', () => {
    const previousSessionStorage = window.sessionStorage
    try {
      delete window.sessionStorage
      saveState('key1', {id: 1})
      readState('key1')
    } finally {
      window.sessionStorage = previousSessionStorage
    }
  })

  it('does not throw when sessionStorage is not available due to security settings', () => {
    const previousSessionStorage = window.sessionStorage
    try {
      Object.defineProperty(window, 'sessionStorage', {
        get: () => {
          const securityError = new Error('broken')
          securityError.name = 'SecurityError'
          throw securityError
        }
      })
      saveState('key1', {id: 1})
      readState('key1')
    } finally {
      delete window.sessionStorage
      window.sessionStorage = previousSessionStorage
    }
  })
})

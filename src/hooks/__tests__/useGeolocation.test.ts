import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGeolocation } from '../useGeolocation'


const mockGeolocation = {
  getCurrentPosition: vi.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with null coordinates and no error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success({
        coords: { latitude: -23.5505, longitude: -46.6333 }
      }), 0)
    })

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.latitude).toBeNull()
    expect(result.current.longitude).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('sets loading to true when getting position', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {})
    
    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.loading).toBe(true)
  })

  it('sets coordinates on successful geolocation', () => {
    const mockPosition = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.latitude).toBe(-23.5505)
    expect(result.current.longitude).toBe(-46.6333)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('sets error on geolocation failure', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1, message: 'User denied the request for Geolocation.' })
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.latitude).toBeNull()
    expect(result.current.longitude).toBeNull()
    expect(result.current.error).toBe('User denied the request for Geolocation.')
    expect(result.current.loading).toBe(false)
  })

  it('handles different error codes', async () => {
    const testCases = [
      {
        code: 1,
        expected: 'User denied the request for Geolocation.',
      },
      {
        code: 2,
        expected: 'Location information is unavailable.',
      },
      {
        code: 3,
        expected: 'The request to get user location timed out.',
      },
      {
        code: 999,
        expected: 'An unknown error occurred.',
      },
    ]

    for (const { code, expected } of testCases) {
      const mockError = { 
        code, 
        message: 'Test error',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      }
      
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError)
      })

      const { result } = renderHook(() => useGeolocation())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe(expected)
    }
  })

  it('handles missing geolocation API', async () => {
    const originalGeolocation = global.navigator.geolocation
    
    Object.defineProperty(global, 'navigator', {
      value: {
        ...global.navigator,
        geolocation: undefined
      },
      configurable: true
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Geolocation is not supported by this browser.')
    expect(result.current.loading).toBe(false)

    Object.defineProperty(global, 'navigator', {
      value: {
        ...global.navigator,
        geolocation: originalGeolocation
      },
      configurable: true
    })
  })
})
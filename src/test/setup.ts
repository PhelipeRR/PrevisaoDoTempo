import '@testing-library/jest-dom'


import { vi } from 'vitest'

Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
      })
    ),
  },
  writable: true,
})


Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
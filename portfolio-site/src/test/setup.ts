import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

document.documentElement.dataset.lightStart = '6'
document.documentElement.dataset.darkStart = '21'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

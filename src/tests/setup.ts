
import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// Global ResizeObserver mock
globalThis.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Enhanced error matching for Zod
expect.extend({
  toHaveValidationError(received, expectedMessage) {
    const pass = received.some(error => error.message === expectedMessage);
    return {
      pass,
      message: () => `Expected validation errors to include: ${expectedMessage}`
    };
  }
});

// JSDOM setup - Vitest provides jsdom natively via environment: 'jsdom'
// No need for jsdom-global/register here
import { vi, expect } from 'vitest'

// Basic window/document check
if (typeof window === 'undefined') {
  throw new Error('JSDOM failed to initialize')
}

export {} // Export to fix import issues
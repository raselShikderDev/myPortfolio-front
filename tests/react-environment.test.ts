// Register jsdom globally before any tests run
import 'jsdom-global/register'

import { describe, expect, test } from 'vitest'
import React from 'react'

// Verify environment is set up
describe('React Environment Test', () => {
  test('global window exists', () => {
    expect(typeof window !== 'undefined').toBe(true)
  })

  test('document exists', () => {
    expect(typeof document !== 'undefined').toBe(true)
  })

  test('React is available', () => {
    expect(React).toBeDefined()
  })
})
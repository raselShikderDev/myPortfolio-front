import { describe, expect, test } from 'vitest'

describe('Simple Tests', () => {
  test('example test', () => {
    const value = 42
    expect(value).toBe(42)
  })

  test('assertion example', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  test('async test example', async () => {
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(true).toBe(true)
  })
})
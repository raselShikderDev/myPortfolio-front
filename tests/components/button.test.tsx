import '@/test-utils/setup'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  test('renders with text', () => {
    render(<Button>Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Submit')
  })

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
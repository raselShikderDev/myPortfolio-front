import '@/test-utils/setup'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  test('renders with placeholder', () => {
    render(<Input placeholder="Enter name" />)
    const input = screen.getByPlaceholderText('Enter name')
    expect(input).toBeInTheDocument()
  })

  test('accepts user input', () => {
    render(<Input placeholder="Name" />)
    const input = screen.getByPlaceholderText('Name')
    fireEvent.change(input, { target: { value: 'John' } })
    expect(input).toHaveValue('John')
  })

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="test-input" />)
    const input = screen.getByPlaceholderText('test-input')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
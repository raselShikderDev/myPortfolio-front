import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderHook } from '@testing-library/react-hooks'
import { BrowserRouter } from 'react-router-dom'

// Render component with providers
export const renderWithProviders = (component, options = {}) => {
  const { wrapper: Wrapper = BrowserRouter } = options
  return render(component, {
    wrapper: Wrapper,
    ...options
  })
}

// Wait for async operations
export const waitFor = async (callback, timeout = 1000) => {
  await waitFor(callback, { timeout })
}

// Fill form fields
export const fillForm = (element, values) => {
  Object.keys(values).forEach(key => {
    const input = screen.getByLabelText(key)
    fireEvent.change(input, { target: { value: values[key] } })
  })
}

// Submit form
export const submitForm = (element) => {
  fireEvent.click(screen.getByRole('button', { type: 'submit' }))
}

// Get form values
export const getFormValues = (element) => {
  const inputs = screen.getAllByRole('textbox')
  return Object.fromEntries(
    inputs.map(input => [input.getAttribute('aria-label'), input.textContent])
  )
}

// Mock API response using MSW
export const mockApiResponse = async (url, response) => {
  // MSW will be set up in test setup
  return { url, response }
}

// Navigate to a route
export const navigateTo = (path) => {
  window.history.pushState({}, '', path)
}

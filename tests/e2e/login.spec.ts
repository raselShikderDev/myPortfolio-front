import { test, expect } from '@playwright/test'

test('login page should load', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toContainText('Login')
})

test('login should show validation error for empty email', async ({ page }) => {
  await page.goto('/login')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Email is required')).toBeVisible()
})

test('login should show error for invalid email format', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'invalid-email')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Invalid email format')).toBeVisible()
})
import { test, expect } from '@playwright/test'

test('homepage should load', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
})

test('should navigate to about page', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/about"]')
  await expect(page).toHaveURL('/about')
})

test('should navigate to projects page', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/projects"]')
  await expect(page).toHaveURL('/projects')
})

test('should navigate to blogs page', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/blogs"]')
  await expect(page).toHaveURL('/blogs')
})

test('should navigate to contact page', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/contact"]')
  await expect(page).toHaveURL('/contact')
})
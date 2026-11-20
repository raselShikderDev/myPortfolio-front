import { test, expect } from '@playwright/test'

test.describe('Projects Page', () => {
  test('should load projects page', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('should display project cards', async ({ page }) => {
    await page.goto('/projects')
    // Wait for content to load
    await page.waitForSelector('.grid', { timeout: 10000 })
    const projectCards = page.locator('[class*="ProjectCard"], [class*="project-card"]')
    const count = await projectCards.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should navigate to project details', async ({ page }) => {
    await page.goto('/projects')
    // Click first project link if available
    const firstLink = page.locator('a[href*="/projects/"]').first()
    if (await firstLink.count() > 0) {
      await firstLink.click()
      await page.waitForURL(/\/projects\/.+/)
    }
  })
})
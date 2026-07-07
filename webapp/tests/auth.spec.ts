import { test, expect } from '@playwright/test'

// Run these tests signed out, ignoring the saved session from auth.setup.ts.
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication', () => {
  test('home page is visible without signing in', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Welcome to Room Booking' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })

  for (const path of ['/persons', '/persons/add', '/rooms', '/rooms/add', '/bookings', '/bookings/add']) {
    test(`visiting ${path} while signed out redirects to the sign-in form`, async ({ page }) => {
      await page.goto(path)

      await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
      await expect(page).toHaveURL('/signin')
    })
  }

  test('signing in from a protected page returns to that page after sign-in', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL
    const password = process.env.E2E_USER_PASSWORD
    test.skip(!email || !password, 'E2E_USER_EMAIL / E2E_USER_PASSWORD not set')

    await page.goto('/rooms')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()

    await page.getByLabel('Email').fill(email!)
    await page.getByLabel('Password').fill(password!)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/rooms')
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })

  test('signing out returns to the home page and protected pages lock again', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL
    const password = process.env.E2E_USER_PASSWORD
    test.skip(!email || !password, 'E2E_USER_EMAIL / E2E_USER_PASSWORD not set')

    await page.goto('/signin')
    await page.getByLabel('Email').fill(email!)
    await page.getByLabel('Password').fill(password!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()

    await page.getByRole('button', { name: 'Sign out' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()

    await page.goto('/rooms')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('wrong password shows an error and stays on the sign-in form', async ({ page }) => {
    await page.goto('/signin')

    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Password').fill('Wrong-password-1!')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL('/signin')
  })
})

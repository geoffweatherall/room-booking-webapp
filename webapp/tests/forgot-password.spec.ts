import { test, expect } from '@playwright/test'

// Run these tests signed out; password reset is a public flow.
test.use({ storageState: { cookies: [], origins: [] } })

// The tests use an email that has no account. The app client has Cognito's
// prevent_user_existence_errors enabled, so the reset flow behaves exactly as
// it does for a real user (generic success, then a code-mismatch rejection)
// without sending any email or hitting per-user reset rate limits.
const unknownEmail = () => `e2e-reset-${Date.now()}@example.com`

test.describe('Forgot password', () => {
  test('sign-in page links to the reset form', async ({ page }) => {
    await page.goto('/signin')

    await page.getByRole('link', { name: 'Forgot password?' }).click()

    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible()
    await expect(page).toHaveURL('/forgot-password')
  })

  test('requesting a code advances to the reset step and a wrong code is rejected', async ({
    page,
  }) => {
    await page.goto('/forgot-password')

    await page.getByLabel('Email').fill(unknownEmail())
    await page.getByRole('button', { name: 'Send code' }).click()

    // Step 2: code + new password.
    await expect(page.getByLabel('Verification code')).toBeVisible()

    await page.getByLabel('Verification code').fill('123456')
    await page.getByLabel('New password').fill('Valid-password-1!')
    await page.getByRole('button', { name: 'Reset password' }).click()

    // The bogus code is rejected and the user stays on the reset form.
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByLabel('Verification code')).toBeVisible()
  })
})

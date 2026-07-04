import { test, expect } from '@playwright/test'

test.describe('Add Booking form - time picker minute options', () => {
  test('start time minute picker excludes 13 and only offers 5-minute boundaries', async ({
    page,
  }) => {
    await page.goto('/bookings/add')
    await expect(page.getByRole('heading', { name: 'Add Booking' })).toBeVisible()

    const startTimeGroup = page.getByRole('group', { name: 'Start time' })
    await startTimeGroup.getByRole('button', { name: /Choose date/i }).click()

    const minuteOptions = page.getByRole('listbox', { name: 'Select minutes' })
    await expect(minuteOptions).toBeVisible()

    const minutes = await minuteOptions.getByRole('option').allTextContents()

    expect(minutes.length).toBeGreaterThan(0)
    expect(minutes).not.toContain('13')
    for (const minute of minutes) {
      expect(Number(minute) % 5).toBe(0)
    }
  })

  test('end time minute picker excludes 13 and only offers 5-minute boundaries', async ({
    page,
  }) => {
    await page.goto('/bookings/add')
    await expect(page.getByRole('heading', { name: 'Add Booking' })).toBeVisible()

    const endTimeGroup = page.getByRole('group', { name: 'End time' })
    await endTimeGroup.getByRole('button', { name: /Choose date/i }).click()

    const minuteOptions = page.getByRole('listbox', { name: 'Select minutes' })
    await expect(minuteOptions).toBeVisible()

    const minutes = await minuteOptions.getByRole('option').allTextContents()

    expect(minutes.length).toBeGreaterThan(0)
    expect(minutes).not.toContain('13')
    for (const minute of minutes) {
      expect(Number(minute) % 5).toBe(0)
    }
  })
})

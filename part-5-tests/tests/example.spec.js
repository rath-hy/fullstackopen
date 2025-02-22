const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByTestId('login-form')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const correctCredentials = {
        username: 'bfranklin',
        password: '1776'
      }

      await page.getByTestId('username-input').fill(correctCredentials.username)
      await page.getByTestId('password-input').fill(correctCredentials.password)
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Bejamin Franklin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const correctCredentials = {
        username: 'bfranklin',
        password: 'wrong'
      }

      await page.getByTestId('username-input').fill(correctCredentials.username)
      await page.getByTestId('password-input').fill(correctCredentials.password)
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Bejamin Franklin logged in')).not.toBeVisible()
    })
  })
})


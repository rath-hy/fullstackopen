const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

const correctCredentials = {
  username: 'bfranklin',
  password: '1776'
}

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
      await loginWith(page, correctCredentials.username, correctCredentials.password)
      await expect(page.getByText('Bejamin Franklin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrong name', 'wrong password') // option 1
      await expect(page.getByText('Bejamin Franklin logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, correctCredentials.username, correctCredentials.password)
    })
  
    test('a new blog can be created', async ({ page }) => {
      const arbitraryNewBlog = {
        title: 'How to be Useless',
        author: 'Arbitrary Author',
        url: 'Arbitrary URL'
      }

      await page.getByRole('button', { name: 'new blog'} ).click()
      await expect(page.getByText('Title')).toBeVisible()
      
      await page.getByTestId('title-input').fill(arbitraryNewBlog.title)
      await page.getByTestId('author-input').fill(arbitraryNewBlog.author)
      await page.getByTestId('url-input').fill(arbitraryNewBlog.url)

      await page.getByRole('button', { name: 'create' }).click()

      const successMessage = `A new blog "${arbitraryNewBlog.title}" by ${arbitraryNewBlog.author} added`
      await expect(page.getByText(successMessage)).toBeVisible()
    })
  })



})

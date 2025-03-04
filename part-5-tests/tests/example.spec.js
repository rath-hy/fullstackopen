const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')
const { createNewBlog } = require('./helper')

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
      await loginWith(page, correctCredentials.username, correctCredentials.password)
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

    test('a blog can be liked', async ({ page }) => {
      await page.getByTestId('view-and-hide').last().click()
      const initialLikeElement = page.getByTestId('like').last().locator('..')
      const initialLikeText = await initialLikeElement.textContent()
      const initialLikeCount = + initialLikeText.slice(0, -5) //removes the 'like'
      await page.getByTestId('like').last().click()
      const newLikeElement = page.getByTestId('like').last().locator('..')
      await expect(newLikeElement).toContainText(`${initialLikeCount + 1} like`)
    })
  
    test.only('a blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => {
        await expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })

      const bottomBlogTitle = await page.getByTestId('blog-title').last().textContent()
      const bottomBlogAuthor = await page.getByTestId('blog-author').last().textContent()

      await expect(page.getByText(`${bottomBlogTitle} ${bottomBlogAuthor}`)).toBeVisible()
      await page.getByTestId('view-and-hide').last().click()
      await page.getByTestId('delete').last().click()
      await expect(page.getByText(`${bottomBlogTitle} ${bottomBlogAuthor}`)).not.toBeVisible()
    })

    test('only post creator sees delete button', async ({ page }) => {
      const newBlog = {
        title: 'Invisible Delete Button',
        author: 'Hidden Author',
        url: 'https://hidden-url.com'
      }
    
      await createNewBlog(page, newBlog.title, newBlog.author, newBlog.url)
      await page.getByTestId('view-and-hide').last().click()
      await expect(page.getByTestId('delete').last()).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByTestId('view-and-hide').last().click()
      await expect(page.getByTestId('delete').last()).not.toBeVisible()
    })
    

    test('blogs are sorted by order of decreasing like count', async ({ page }) => {
      const viewButtons = page.getByTestId('view-and-hide')
      const buttonCount = await viewButtons.count()

      console.log('buttonCount', buttonCount)

      var likesArr = []

      for (let i = buttonCount - 1; i >= 0; i--) {
        await viewButtons.nth(i).click()
        console.log('*')
        likesArr.push(0)
      }
    })

  })

})

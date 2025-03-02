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

    test('a blog can be liked', async ({ page }) => {
      //view the last blog
      await page.getByTestId('view-and-hide').last().click()
  
      //get the initial like count
      const initialLikeElement = page.getByTestId('like').last().locator('..')
      const initialLikeText = await initialLikeElement.textContent()
      const initialLikeCount = + initialLikeText.slice(0, -5) //removes the 'like'
  
      // console.log(initialLikeCount, '***')
      // console.log(typeof(initialLikeCount), '***')
  
      //like the blog
      await page.getByTestId('like').last().click()

      // await expect(initialLikeElement).toContainText(`${initialLikeCount + 1} like`)

      const newLikeElement = page.getByTestId('like').last().locator('..')
      const newLikeText = await newLikeElement.textContent()
      const newLikeCount = + newLikeText.slice(0, -5)

      // console.log(newLikeCount, '&&&')

      await expect(newLikeElement).toContainText(`${initialLikeCount + 1} like`)
    })
  
    test('a blog can be deleted', async ({ page }) => {
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


  })

  





})

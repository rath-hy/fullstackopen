const { expect } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username-input').fill(username)
  await page.getByTestId('password-input').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNewBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog'} ).click()
  await expect(page.getByText('Title')).toBeVisible()
  
  await page.getByTestId('title-input').fill(blog.title)
  await page.getByTestId('author-input').fill(blog.author)
  await page.getByTestId('url-input').fill(blog.url)

  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createNewBlog }
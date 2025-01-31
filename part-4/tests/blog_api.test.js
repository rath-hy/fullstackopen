const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

//should it be here
const Blog = require('../models/blog')

const api = supertest(app)

test.only('notes are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    // console.log('***response: ', response.body)

    //this is supposed to be 4 in the mongoDB database
    assert.strictEqual(response.body.length, 6)
})

test.only('id property is correctly named', async () => {
    const response = await api 
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    // console.log('***response: ', response.body)

    response.body.forEach(blog => {
        assert.ok(blog.id, `Blog with ${blog.title} does not have valid id property.`)
    })

    response.body.forEach(blog => {
        assert.strictEqual(blog._id, undefined, `Blog with title ${blog.title} has improper _id property.`)
    })
    
})

test.only('new blog post can be added', async () => {
    const newBlogPost = {
        _id: "9a429a851b54a996234d19f9",
        title: "How to make fried rice",
        author: "Bok Choy",
        url: "https://friedrice.com/",
        likes: 20,
    }

    await api 
        .post('/api/blogs')
        .send(newBlogPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const blogIds = response.body.map(blog => blog.id)
    assert.strictEqual(blogIds.length, initialBlogs.length + 1)
    assert(blogIds.includes(newBlogPost._id))
})

test.only('if likes missing, default to zero', async () => {
  const newBlogPost = {
    title: "Why I'm so unpopular",
    author: "Cho Chang",
    url: "https://friedrice.com",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})


test.only('if title or url missing, 400', async () => {
  const blogWithoutTitle = {
    author: "Cole Galvan",
    url: "https://cgalvan.com"
  }

  const blogWithoutUrl = {
    title: "Why I'm so popular",
    author: "Gina Kehr",
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
  
    await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})


test.only('succeeds with 204 if error is valid', async () => {
  const validId = initialBlogs[0]._id

  await api
    .delete(`/api/blogs/${validId}`)
    .expect(204)
}) 

test.only('eror 400 if invalid id', async () => {
  const invalidId = "123"
  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(400)
})







const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]


beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

after(async () => {
  await mongoose.connection.close()
})



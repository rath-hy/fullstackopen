const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test.only('notes are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    console.log('***response: ', response.body)

    //this is supposed to be 4 in the database
    assert.strictEqual(response.body.length, 4)
})

test.only('id property is correctly named', async () => {
    const response = await api 
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    console.log('***response: ', response.body)

    response.body.forEach(blog => {
        assert.ok(blog.id, `Blog with ${blog.title} does not have valid id property.`)
    })

    response.body.forEach(blog => {
        assert.strictEqual(blog._id, undefined, `Blog with title ${blog.title} has improper _id property.`)
    })
    
})



after(async () => {
  await mongoose.connection.close()
})



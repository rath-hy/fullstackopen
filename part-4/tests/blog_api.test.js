const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const api = supertest(app);

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

let token;
let arbitraryUser;
let arbitraryUserAdditionResponse;
let arbitraryLoginInfoReturned;

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  arbitraryUser = {
    username: 'guyfawkes',
    name: 'Guy Fawkes',
    password: 'parliament69',
  };

  arbitraryUserAdditionResponse = await api
    .post('/api/users')
    .send(arbitraryUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  arbitraryLoginInfoReturned = await api
    .post('/api/login')
    .send({
      username: arbitraryUser.username,
      password: arbitraryUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  token = arbitraryLoginInfoReturned.body.token;
});

describe('when there are some notes saved initially', () => {
  test('notes are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('id property is correctly named', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    response.body.forEach((blog) => {
      assert.ok(blog.id, `Blog with ${blog.title} does not have valid id property.`);
    });

    response.body.forEach((blog) => {
      assert.strictEqual(blog._id, undefined, `Blog with title ${blog.title} has improper _id property.`);
    });
  });

  describe('note creation', () => {
    test('succeeds with valid data', async () => {

      const newBlogPost = {
        title: 'How to make fried rice',
        author: 'Bok Choy',
        url: 'https://friedrice.com/',
        likes: 20,
      };
      
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogPost)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      const blogIds = response.body.map((blog) => blog.id);
      assert.strictEqual(blogIds.length, initialBlogs.length + 1);
    });

    test('if likes missing, default to zero', async () => {
      const newBlogPost = {
        title: "Why I'm so unpopular",
        author: 'Cho Chang',
        url: 'https://friedrice.com',
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogPost)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test('if title or url missing, 400', async () => {
      const blogWithoutTitle = {
        author: 'Cole Galvan',
        url: 'https://cgalvan.com',
        userId: "67a7c324f5dbc41e99f47a71"
      };

      const blogWithoutUrl = {
        title: "Why I'm so popular",
        author: 'Gina Kehr',
        userId: "67a7c324f5dbc41e99f47a71"
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400);
      
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400);
    });


    test('if token not provided, 401', async () => {
      const arbitraryBlogPost = {
        title: 'i exist to be deleted',
        author: 'kill me please',
        url: 'https://iwanttodisappear.com/',
        likes: 0,
      };
      
      const arbitraryBlogPostResponse = await api
        .post('/api/blogs')
        // .set('Authorization', `Bearer ${token}`)
        .send(arbitraryBlogPost)
        .expect(401)
        // .expect('Content-Type', /application\/json/);

    })
  });

  describe('note deletion', () => {
    test('succeeds with 204 if id is valid', async () => {

      const arbitraryBlogPost = {
        title: 'i exist to be deleted',
        author: 'kill me please',
        url: 'https://iwanttodisappear.com/',
        likes: 0,
      };
      
      const arbitraryBlogPostResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(arbitraryBlogPost)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const validId = arbitraryBlogPostResponse.body.id
      
      await api
        .delete(`/api/blogs/${validId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    test('error 400 if invalid id', async () => {
      const invalidId = '123';
      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('note modification', () => {
    test('updating note is possible', async () => {
      const updatedBlog = {
        id: '5a422a851b54a676234d17f7',
        likes: 70,
      };

      const response = await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, updatedBlog.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
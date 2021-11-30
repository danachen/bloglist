const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
  { title: 'how to be nimble' },
  { title: 'how to be kiner' }, 
  { title: 'how to be tougher' },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

test('blog posts returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are correct number of blog posts', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test ('a blog can be added', async() => {
  const newBlog = {
    title: 'how to be more flexible'
  }

  await api.post('/api/blogs')
           .set('Authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYTYxMDJiNWNiNTk2ODI5Yjk3ZmQ5MSIsImlhdCI6MTYzODI3MzE1Nn0.7NmwWQImd0Tu1BC7iuuxTTW2-91YTsk0LLygcEuLiKU")
           .send(newBlog)
           .expect(200)
           .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain('how to be more flexible')
})

test ('each blog has its own id', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test ('adding blog without likes results in default likes of 0', async() => {
  const newBlog = {
    title: 'how to be more flexible'
  }

  await api.post('/api/blogs')
           .send(newBlog)
           .expect(200)
           .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[0].likes).toBe(0)
})

test ('backend responds to request with 400 if title and url are missing', async() => {
  const newBlog = {
    likes: 15
  }

  await api.post('/api/blogs')
           .send(newBlog)
           .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
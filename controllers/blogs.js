const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()

  if (!savedBlog.author && !savedBlog.title) {
    return response.status(400).json({status: 400, message: 'no author or title'})
  }

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog)
    return response.status(200).json({status: 200, data: savedBlog, message: 'successfully updated user'})
  } catch(e) {
    return response.status(400)
  }
})

module.exports = blogsRouter
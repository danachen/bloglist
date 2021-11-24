const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  let savedBlog = await blog.save()

  if (!savedBlog.author && !savedBlog.title) {
    return response.status(400).json({status: 400, message: 'no author or title'})
  }

  savedBlog = await blog.save()
  response.json(savedBlog)
  return response.status(200).json({status: 200, data: savedBlog, message: 'successfully added blog post'})
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const post = {
    title: body.title,
    likes: body.likes,
    url: body.url,
  }

  let updatedPost = await Blog.findByIdAndUpdate(request.params.id, post)
  response.json(updatedPost)
})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleWare = require('../utils/middleware')
const tokenExtractor = middleWare.tokenExtractor
const userExtractor = middleWare.userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  const token = request.token
  const requestUser = request.user
  console.log(token)
  console.log(requestUser)
  if (!token || !requestUser.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  
  let savedBlog = await blog.save()
  const user = await User.findById(requestUser.id)
  console.log(user);
  savedBlog.author = user

  if (!savedBlog.title) {
    return response.status(400).json({status: 400, message: 'no title'})
  }

  savedBlog = await blog.save()

  if (user.blogs) {
    user.blogs = user.blogs.concat(savedBlog._id)
  } else {
    user.blogs = [savedBlog._id]
  }
  
  await user.save()

  response.json(savedBlog)
  return response.status(200).json({status: 200, data: savedBlog, message: 'successfully added blog post'})
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const blogAuthorId = blog.author.toString();

  const token = request.token
  const user = request.user

  if (!token || !user.id || blogAuthorId !== user.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }

  await Blog.findByIdAndRemove(request.params.id)
  return response.status(204).end()
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
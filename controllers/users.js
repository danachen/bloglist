const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  if (!user.username || !user.passwordHash) {
    return response.status(400).json({status: 400, message: 'need both username and password'})
  }

  if (user.username.length < 3 || user.passwordHash.length < 3) {
    return response.status(400).json({status: 400, message: 'user name and passwords need to be longer than 3 characters'})
  }

  // if (!user.username.unique) {
  //   return response.status(400).json({status: 400, message: 'username is already taken'})
  // }

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async(request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter
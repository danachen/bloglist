const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.blogs = returnedObject.blogs ? returnedObject.blogs : []
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

userSchema.plugin(uniqueValidator, { message: 'Error, expected user name to be unique.' })
module.exports = User
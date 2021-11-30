const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  url: String,
  likes: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.title
    returnedObject.id = returnedObject._id.toString()
    returnedObject.likes = returnedObject.likes ? returnedObject.likes : 0
    returnedObject.url = returnedObject.url ? returnedObject.url : ''
    delete returnedObject._id
    delete returnedObject._v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
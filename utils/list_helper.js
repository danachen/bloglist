var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (posts) => {
  return posts.reduce((sum, post) => {
    return sum + post.likes
  }, 0)
}

const favoriteBlog = (posts) => {
  let sortedPosts = Array.from(posts)
  return sortedPosts.sort((a, b) => {
    return b.likes - a.likes
  })[0]
}

const mostBlogs = (posts) => {
  let listObj = _.countBy(posts, 'author')
  let sortedAuthors = Object.keys(listObj).sort((a, b) => {
    return listObj[b] - listObj[a]
  })

  return {author: sortedAuthors[0], blogs: listObj[sortedAuthors[0]]}
}

const mostLikes = (posts) => {
  let obj = {}

  for (let post of posts) {
    if (obj[post.author]) {
      obj[post.author] += post.likes;
    } else {
      obj[post.author] = post.likes
    }
  }

  const mostLikedAuthor = Object.keys(obj).sort((a, b) => obj[b] - obj[a])[0]

  return {author: mostLikedAuthor, likes: obj[mostLikedAuthor]}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
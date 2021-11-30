const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
  })

  test('create with new username', async () => {
    const usersAtStart = await helper.initialUsers()

    const newUser = {
      username: 'dchen',
      name: 'Dana C',
      password: 'fso'
    }

    await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.initialUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)

  })

  test('creating new user fails if username already taken', async () => {
    const usersAtStart = await helper.initialUsers()

    const newUser = {
      username: 'root',
      name: 'Dana C',
      password: 'fso'
    }
    // Problem with the test here
    const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
    const usersAtEnd = await helper.initialUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)

  })
})

afterAll(() => {
  mongoose.connection.close()
})
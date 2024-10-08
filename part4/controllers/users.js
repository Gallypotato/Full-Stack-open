const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // validate username
  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  // validate password
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs')
  res.json(users)
})
module.exports = usersRouter
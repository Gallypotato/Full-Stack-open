const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs');

usersRouter.post('/', async (request, response, next) => {
    const {username, name, password} = request.body
    
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

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', {content:1, date: 1}) 
  response.json(users)
})



module.exports = usersRouter
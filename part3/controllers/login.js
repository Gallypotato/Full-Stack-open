const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    console.log('Username:', username)
    console.log('Password:', password)

    // user and password verify
    const user = await User.findOne({username})

    console.log('User found:', user)

    const passwordCorrect = (user === null)
      ? false
      : await bcrypt.compare(password, user.passwordHash)
    
    console.log('Password correct:', passwordCorrect)

    if(!(password && passwordCorrect)) {
        return res.status(401).json({
            error:'invalid username or password'
        })
    }  
    // token
    const userForToken = {
        username: user.username,
        id: user._id,
      }

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        {expiresIn: 60*60}
      )

    console.log('Generated token:', token)
    
    // response
    res
      .status(200)
      .send({ token, username: user.username, name: user.name})

})

module.exports = loginRouter
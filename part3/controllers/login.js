const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    // user and password verify
    const user = await User.findOne({username})
    const passwordCorrect = (user === null)
      ? false
      : await bycrypt.compare(password, user.passwordHash)

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

    // response
    res
      .status(200)
      .send({ token, username: user.username, name: user.name})

})

module.exports = loginRouter
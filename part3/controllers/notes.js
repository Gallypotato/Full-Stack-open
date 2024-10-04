const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) { // Bearer is Authorization header. The header also tells which authentication scheme is used.
    return authorization.replace('Bearer ', '')
  } else {
    return resizeBy.status(401).json({error: 'Authorization header is missing or invalid '})
  }
  return null
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', {username: 1, name: 1 })
  response.json(notes)

})

notesRouter.get('/:id', async (request, response, next) => {

    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }

})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id){ // user not exist
    return response.status(401).json({error:'token invalid, no id'})
  }
  const user = await User.findById(decodedToken.id)
  console.log('user ', user)
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)

})

notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)

})

module.exports = notesRouter
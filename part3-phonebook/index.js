require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
const Person  = require('./models/person')


//app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//3.16
//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.static('build'))
//let persons = [
//    {
//        id: 1,
//        name: "Arto Hellas",
//        number: "040-123456"
//      },
//      {
//        id: 2,
//        name: "Ada Lovelace",
//        number: "39-44-5323523"
//      },
//      {
//        id: 3,
//        name: "Dan Abramov",
//        number: "12-43-234345"
//      },
//      {
//        id: 4,
//        name: "Mary Poppendieck",
//        number: "39-23-6423122"
//      }
//]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//3.8
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//3.1
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


//3.2
app.post('/info',(request,response) => {
  const receivedTime = new Date().toUTCString()
  const maxId = Person.length > 0
    ? Math.max(...Person.map(n => n.id))
    : 0

  response.send(
    `<p>Phonebook has info for ${maxId} people<br/>${receivedTime} </p>`
  )
})
//3.3
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      console.log('x')
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


//3.4
//app.delete('/api/persons/:id', (request, response) => {
//  const id = Number(request.params.id)
//  persons = persons.filter(person => person.id !== id)
//  response.status(204).end()
//})

//3.5 has used mongoDB id
//const generateId = () => {
//    const maxId = Person.length > 0
//      ? Math.max(...Persons.map(n => n.id))
//      : 0
//    const min = maxId + 1
//    const max = 1000
//
//    if (min>=max) { return 0}
//    const randomId = Math.floor(Math.random() * (max - min)) + min;
//    return randomId
//}


//3.6
app.post('/api/persons',(request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({
        name: body.name,
        number: body.number || false,
      })

      return person.save()
    })
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//3.15
app.delete('/api/persons/:id', (request, response, next) => {
  console.log('Deleting person with id:', request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//3.17
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number || false,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// handler of requests with unknown endpoint
app.use(unknownEndpoint)
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
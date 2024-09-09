const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//3.8
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})


//3.2
app.post('/info',(request,response) => {
    const receivedTime = new Date().toUTCString();
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0

    response.send(
        `<p>Phonebook has info for ${maxId} people<br/>${receivedTime} </p>`
    )
})
//3.3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      console.log('x')
      response.status(404).end()
    }
  })

//3.4
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

//3.5
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    const min = maxId + 1
    const max = 1000

    if (min>=max) { return 0}
    const randomId = Math.floor(Math.random() * (max - min)) + min;
    return randomId
}


//3.6
app.post('/api/persons',(request, response) =>{
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
    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
          error: 'name must be unique'
        });
      }
    
    const person = {
        name: body.name,
        number: body.number || false,
        id: generateId(),
    }

    console.log(person.id)
    
    persons = persons.concat(person)
    
    response.json(person)
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
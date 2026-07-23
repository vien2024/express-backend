// node --watch index.js
const express = require('express')
const cors = require('cors')
const app = express()

//var morgan = require('morgan')
//app.use(morgan('tiny'))

let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// morgan.token('body', (req) => {
//   return Object.keys(req.body).length ? JSON.stringify(req.body) : '';
// });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  //const maxId =
  //  notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
  //return String(maxId + 1)
  return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  if( notes.find((note) => note.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const id = generateId()
  while (notes.find((note) => note.id === id)) {
    id = generateId()
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  notes = notes.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${notes.length} people</p><p>${date}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
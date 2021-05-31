const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
          {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
          },
          {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
          },
          {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
          },
          {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
          }
]


app.get('/', (request, response) => {
  response.send('Phonebook API server')
})

app.get('/info', (request, response) => {
    var crtTime = new Date().toString()
    response.send('Phonebook has info for ' + persons.length + " people  <br />\r\n " + crtTime)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    //const maxId = persons.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    //return maxId + 1
    const maxId = 999999999
    return Math.floor(Math.random() * maxId);
}


app.post('/api/persons', (request, response) => {
  
    const body = request.body

    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing' 
      })
    }
    if(!body.number) {
        return response.status(400).json({ 
            error: 'Number missing' 
        })    
    }
    if(persons.find(({name}) => name === body.name)!==undefined) {
        return response.status(400).json({ 
            error: 'Name already exists' 
        })    
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

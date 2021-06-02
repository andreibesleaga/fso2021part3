const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, request, response, next) => {
  // console.error(error.name, error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

app.get('/', (request, response) => {
  response.send('Phonebook API server')
})

app.get('/info', (request, response) => {
    var crtTime = new Date().toString()  
    Person.countDocuments({}).then(docCount => {
      response.send('Phonebook has info for ' + docCount + " people  <br />\r\n " + crtTime)
    })
    .catch(err => {
      response.send('Phonebook error getting users from MongoDB  <br />\r\n ' + crtTime)
    })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if (!body.name || body.name===undefined) {
      return response.status(400).json({error: 'Name missing' })
    }
    if(!body.number || body.number===undefined) {
        return response.status(400).json({ error: 'Number missing'  })    
    }    
    Person.findOne({name: body.name}).then( person => {
      if(person) {
        return response.status(400).json({ error: 'Name already exists' })
      } else {
          const person = new Person ({
            name: body.name,
            number: body.number
          })
          person.save().then(savedPerson => {
            response.json(savedPerson)
          })    
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

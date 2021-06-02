import './index.css'
import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = (props) => {
  if (props===null || props.message===null || props.message.message === null || props.message.message===undefined || props.message.message==='') {
    return null
  } else {
    return (
      <div className={props.message.type}>
        {props.message.message}
      </div>
    )
  }
}

const filterPersons = (persons, filter) => {
  const filteredPersons = []
  persons.forEach(person => {
    if( person.name.toLowerCase().indexOf(filter.toLowerCase()) === 0 ) {
      filteredPersons.push(person)
    }
  })
  return filteredPersons
}

const Filter = (props) => {
  return (
    <input value={props.filter} onChange={props.handleFilterChange} />
  )
}

const Persons = (props) => {
  const filteredPersons = filterPersons(props.persons, props.filter)
  return (
    <ul>
      {filteredPersons.map(person => 
        <Person key={person.name} persona={person} handlePersonDelete={props.handlePersonDelete} />
      )} 
    </ul>  
  )
}

const Person = (props) => {
  return (
      <li> 
        {props.persona.name} : {props.persona.number} <button value={props.persona.id} onClick={props.handlePersonDelete}>delete</button> <br />
      </li>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
    <div>
      name: <input type="text" value={props.newName} onChange={props.handleNameChange} />
      number: <input type="text" value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}


const App = () => {

  const [ persons, setPersons ] = useState([
    /*
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Artos Fella', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }    
    */
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setNewFilter ] = useState('')
  const [ message, setMessage ] = useState({type:'',message:''})

  useEffect(() => {
    getAll()
  }, [])
  

  const getAll = () => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    if(newName===''||newNumber==='') {
      alert('name and number must not be empty!')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    const result = persons.find( ({ name }) => name === newName );

    if(result===undefined) {
      personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setMessage({type:'info',message:`${newName} added to server`})
        setTimeout(() => { setMessage(null) }, 5000)
      })
      .catch(error => {
          // Error
          var emessage = 'Error saving person to server'
          if (error.response && error.response.data) {
            emessage = error.response.data.error
          } else if (error.request) {
            emessage = error.request;
          } else {
            emessage = error.message;
          }        
        setMessage({type:'error',message:`${emessage}`})
        setTimeout(() => { setMessage(null) }, 5000)
      })
      setNewName('')
      setNewNumber('')
    } else {
      if(window.confirm(`${newName} is already added to phonebook. Do you want to update phone number ?`)) {
        personService.update(result.id, personObject)
        .then(response => {
          getAll()
          setMessage({type:'info', message:`${newName} number updated on server`})
          setTimeout(() => { setMessage(null) }, 5000)
        }).catch(error => {
          // Error
          var emessage = 'Error updating person on server'
          if (error.response && error.response.data) {
            emessage = error.response.data.error
          } else if (error.request) {
            emessage = error.request;
          } else {
            emessage = error.message;
          }        
          setMessage({type:'error',message:`${emessage}`})
          setTimeout(() => { setMessage(null) }, 5000)
          getAll()
        })
      }
      setNewName('')
      setNewNumber('')
    }

  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handlePersonDelete = (event) => {
    if(window.confirm(`Are you sure you want to delete the person?`)) {
      personService.erase(event.target.value)
      .then(response => {
        //setPersons(persons.filter(person => person.id !== event.target.value))
        getAll()
        setMessage({type:'info', message:`Person removed from server`})
        setTimeout(() => { setMessage(null) }, 5000)
      }).catch(error => {
        setMessage({type:'error', message:`Error removing from server`})
        setTimeout(() => { setMessage(null) }, 5000)
        getAll()
      })
    }
  }
  

  return (
    <div>      
      <h2>Phonebook</h2>
      <Notification message={message} />
      <p>filter names:
        <Filter handleFilterChange={handleFilterChange} filter={filter} /> <br />
      </p>
      <h2>add a new: </h2>
        <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
        <Persons persons={persons} filter={filter} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}


export default App
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.fjhoo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length===5) {
  const cname = process.argv[3]
  const cnumber = process.argv[4]

  const person = new Person({
    name: cname,
    number: cnumber
  })

  person.save().then(result => {
    console.log(`Added ${cname} ${cnumber} to phonebook`)
    mongoose.connection.close()
  })

} else {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}




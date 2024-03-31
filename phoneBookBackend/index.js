require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/note')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler =(error,request,response,next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error:error.message })
  }

  next(error)
}

app.get('/',(request,response) => {

  response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})
app.get('/info',(request,response) => {
  Person.find({})
    .then( id => {
      const IDlength = id.length
      let day = new Date()
      response.send(`<p>Phonebook has info of ${IDlength} people</p><br/><p>${day.toString()}</p>`)
    })
})
app.get('/api/persons/:id',(request,response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response ,next) => {
  Person.findByIdAndDelete(request.params.id).then( () => {
    response.status(204).end()
  })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true,  runValidators: true, context: 'qeury' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})


app.post('/api/persons',(request,response,next) => {
  const { name, number } = request.body

  const person =new Person ({
    name : name,
    number: number,
  })
  person.save().then(
    newPersonInPhonebook => {
      response.json(newPersonInPhonebook)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

morgan.token('body',(request) => JSON.stringify(request.body))
const PORT = process.env.PORT || 3001
app.listen(PORT,() => { })
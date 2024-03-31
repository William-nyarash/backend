const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then( () => {
    'the server is up'
  })
  .catch((error) => {
    console.log('error:',error)
  })
  // added the mongoose unique validator to the schema
const personSchema = new mongoose.Schema({
  name:{
    type: String,
    minLength: 3,
    required: [true,'the name should be more than 3 characters long'],
    unique:true
  },
  number: {
    type: String,
    unique:true,
    validate:{
      validator: function(v) {
        return /\d{3}-\d{7}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minLength: 8,
    required:[true,'user phone number is required']
  } })
// apply the unique validator plugin to the person schema
personSchema.plugin(uniqueValidator)
personSchema.set('toJSON',{
  transform: ( document, returnedObject) => {
    returnedObject.id =returnedObject._id
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)
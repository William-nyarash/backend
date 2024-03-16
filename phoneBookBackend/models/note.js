const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
        .then( res=>{
        })
        .catch((error)=>{
          console.log("error:",error)
        })

    const personSchema = new mongoose.Schema({
        name:{
          type: String,
          minLength: 3,
          required: true
        },
        number: String,
    })

  personSchema.set('toJSON',{
    transform: ( document, returnedObject)=>{
        returnedObject.id =returnedObject._id
        delete returnedObject.__v
        delete returnedObject._id
    }
  })



     module.exports = mongoose.model('Person', personSchema)
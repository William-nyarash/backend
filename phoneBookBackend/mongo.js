const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} 

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]
const url =`mongodb+srv://waren:${password}@cluster0.s9d1fnl.mongodb.net/persons?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personschema = new mongoose.Schema({
  name: String,
  number:String,
})

const Persons = mongoose.model('person', personschema)

const person= new Persons({
  name:personName,
  number:personNumber,
})
 if(process.argv.length == 3){
  Persons.find({}).then( person=>{
    console.log("phonebook:\n")
    person.forEach((person)=>console.log(person.name,person.number))
    mongoose.connection.close()
 })
  }
 else{person.save().then(result=>{
  console.log("added",person.name ,'number',person.number,'to phonebook')
})}

Persons.find({}).then(result =>{
  result.forEach(person =>{});
  mongoose.connection.close()
});



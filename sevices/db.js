// to give mongodb connection details

// import mongoose
const mongoose =require('mongoose')

// state connection string
mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

// model creation
// collection name kodukkumbo first letter must be capital letter and not plureal in this time
const User =mongoose.model('User',{
 acno: Number, 
 uname:String,
  password: String,
   balance: Number, 
   transaction: [] 
})

// Export model -User
module.exports={
    User
}
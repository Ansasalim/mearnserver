// import express
const express = require('express')

const dataservice=require('./sevices/data_services')

const jwt=require('jsonwebtoken')

const cors=require('cors')

// create an  server app using express
const app= express()

// use cors to specify origin
app.use(cors({
    origin:'http://localhost:4200'
}))

// to parse json
app.use(express.json())

// resolve http req from client

// GET -to read data
app.get('/',(req,res) => { 
    // user set the status
res.status(401).send("IT'S  A GET METHOD")
})

// POST -to create data
app.post('/',(req,res) => { 
res.send("IT'S  A POST METHOD")
})

// PUT -to update/modify data
app.put('/',(req,res) => { 
res.send("IT'S  A PUT METHOD")
})

// PATCH- to modify partially data
app.patch('/',(req,res) => { 
res.send("IT'S  A PATCH METHOD")
})
    
// DELETE- to delete data
app.delete('/',(req,res) => { 
res.send("IT'S  A DELETE METHOD")
})
    

// Application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log("Application specific middleware")
    next()
}

app.use(appMiddleware)

// bank app - API

// jwt token-to verify token
const jwtMiddleware =(req,res,next)=>{

 try{  
      const token=req.headers["x-access-token"]
    // verify token
const data=jwt.verify(token,'supersecretkey123')
req.currentAcno=data.currentAcno
next()
}
catch{
    res.status(422).json({
        statusCode:422,
        status:false,
        message:"please log in"
    })
}
}

// register- API
app.post('/register',(req,res)=>{

 dataservice.register(req.body.acno,req.body.password,req.body.uname)
 .then(result=>{
    res.status(result.statusCode).json(result)
 })

//  if(result){
//      res.send("Registerd successfully")
//  }
//  else{
//      res.send("already exist!!!! please log in...")
//  }
})


// login- API
app.post('/login',(req,res)=>{

   dataservice.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
   })

   // deposite- API
app.post('/deposit',jwtMiddleware,(req,res)=>{

    dataservice.deposit(req.body.acno,req.body.password,req.body.amt)
   .then(result=>{
    res.status(result.statusCode).json(result)
   }) 
   })
 

//    withdraw API
   app.post('/withdraw',jwtMiddleware,(req,res)=>{

    dataservice.withdraw(req,req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
         res.status(result.statusCode).json(result)
   })
})


//    Transacton API
   app.post('/transaction',jwtMiddleware,(req,res)=>{

    dataservice.getTransaction(req.body.acno)
    .then(result=>{
    res.status(result.statusCode).json(result)
   })
})

// delete API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    // asynchronous
    dataservice.deleteAcc(req.params.acno)
    .then(result=>{
    res.status(result.statusCode).json(result) 
})
})

// set up the port number
app.listen(3000,()=>{
console.log("server started at port number:3000");
})


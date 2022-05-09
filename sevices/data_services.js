// import token
const jwt = require('jsonwebtoken')

// import User model
const db = require('./db')

database = {
  1000: { acno: 1000, uname: "Neer", password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "veer", password: 1001, balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "seer", password: 1002, balance: 5000, transaction: [] },
}

//   register definition

const register = (acno, password, uname) => {

  // asynchronous
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 422,
          status: false,
          message: "User already exist....please login..."
        }
      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "successfully registered"
        }
      }

    })

  // if (acno in database) {
  //   return {
  //     statusCode: 422,
  //     status: false,
  //     message: "User already exist....please login..."
  //   }
  // }
  // else {

  //   database[acno] = {
  //     acno,
  //     uname,
  //     password,
  //     balance: 0,
  //     transaction: []
  //   }
  //   console.log(database);

  //   return {
  //     statusCode: 200,
  //     status: true,
  //     message: "successfully registered"
  //   }
  // }
}


// login definition

const login = (acno, password) => {
  // asynchronous
  return db.User.findOne({ acno, password })
    .then(user => {
      if (user) {
        currentAcno = acno
        currentUname = user.uname

        // token generation
        const token = jwt.sign({
          currentAcno: acno
        }, 'supersecretkey123')

        return {
          statusCode: 200,
          status: true,
          message: "successfully login!!!!!",
          currentAcno,
          currentUname,
          token
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "incorrect password/account number"
        }
      }
    })
}
// if (acno in database) {

//   if (password == database[acno]["password"]) {
//     currentAcno = acno

//     currentUname = database[acno]["uname"]

//     // token generation

//     const token = jwt.sign({
//       currentAcno: acno
//     }, 'supersecretkey123')

//     return {
//       statusCode: 200,
//       status: true,
//       message: "successfully registered",
//       currentAcno,
//       currentUname,
//       token
//     }
//   }

//     else {
//       return {
//         statusCode: 422,
//         status: false,
//         message: "incorrect password"
//       }
//     }
//   }

//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "User does not exist"
//     }
//   }
// }


// deposit
const deposit = (acno, password, amt) => {
  var amount = parseInt(amt)

  // asynchronous
  return db.User.findOne({ acno, password })
    .then(user => {
      if (user) {
        user.balance += amount
        user.transaction.push({
          amount: amount,
          type: "CREDIT"
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: "successfully deposited...And new balance is" + user.balance
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "incorrect password/account number"
        }
      }
    })
}

// if (acno in database) {

//   if (password == database[acno]["password"]) {
//     // console.log(database[acno].balance );

//     database[acno]["balance"] += amount
//     database[acno]["transaction"].push({
//       amount: amount,
//       type: "CREDIT"
//     })

//     return {
//       statusCode: 200,
//       status: true,
//       message: "successfully deposited...And new balance is" + database[acno]["balance"],
//     }
//   }
//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "incorrect password"
//     }
//   }
// }

//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "User does not exist"
//     }
//   }
// }

// WITHDRAW definition

const withdraw = (req, acno, password, amt) => {

  var amount = parseInt(amt)
  var currentAcno = req.currentAcno

  // asynchronous
  return db.User.findOne({ acno, password })
    .then(user => {
      if (currentAcno != acno) {
        return {
          statusCode: 422,
          status: false,
          message: "permission  denied!!!!"
        }
      }
      if (user) {
     
        if (user.balance >= amount) {
          user.balance -= amount
          user.transaction.push({
            amount: amount,
            type: "DEBIT"
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            message:amount+ "successfully debited...And new balance is" + user.balance
          }
        }
        else {
          return {
            statusCode: 422,
            status: false,
            message: "insufficient balance"
          }
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "incorrect password/account number"
        }
      }
    })
}



//   var currentAcno = req.currentAcno

//   if (acno in database) {

//     if (password == database[acno]["password"]) {

//       if (currentAcno == acno) {

//         if (database[acno]["balance"] > amount) {
//           database[acno]["balance"] -= amount
//           database[acno]["transaction"].push({
//             amount: amount,
//             type: "DEBIT"
//           })
//           console.log(database);
//           return {
//             statusCode: 200,
//             status: true,
//             message: "successfully debited...And new balance is" + database[acno]["balance"]
//           }
//         }

//         else {

//           return {
//             statusCode: 422,
//             status: false,
//             message: "insufficient bal"
//           }
//         }
//       }
//       else {
//         return {
//           statusCode: 422,
//           status: false,
//           message: "operation denied!!!!"
//         }
//       }
//     }
//     else {
//       return {
//         statusCode: 422,
//         status: false,
//         message: "incorrect password"
//       }
//     }
//   }
//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "user does not exist"
//     }
//   }
// }

// transaction definition

const getTransaction = (acno) => {

  // asynchronous
  return db.User.findOne({ acno})
.then(user=>{
  if (user) {
    return {
      statusCode: 200,
      status: true,
      transaction: user.transaction
    }
  }
  else{
    return {
      statusCode: 422,
      status: false,
      message: "user does not exist"
    }
  }

})
  // if (acno in database) {
  //   return {
  //     statusCode: 200,
  //     status: true,
  //     transaction: database[acno]["transaction"]
  //   }
  // }
  // else {
  //   return {
  //     statusCode: 422,
  //     status: false,
  //     message: "user does not exist"
  //   }
  // }
}

// delete API
const deleteAcc=(acno)=>{
  // asynchronous
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statusCode: 422,
      status: false,
      message: "Operation Failed!!!!!!"
      }
    }
  return{
    statusCode: 200,
      status: true,
      message: "The requested account number"+acno+"deleted successfully"
  }
  })
}

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}


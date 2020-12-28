
const app = require('../src/app')
const port = process.env.PORT
app.listen(port, () => {
   console.log('SERVER IS RUNNING ON PORT:', port)
});









// app.post('/users', (req, res) => {
//    const user = new User(req.body)
//    user.save().then((userObj) => {
//       res.send(userObj)
//    }).catch((error) => {
//       res.status(400).send(error)
//    });
// });
// app.get('/user', (req, res) => {
//    User.find(req.body).then((users) => {
//       if (!users) {
//          return res.status(404).send()
//       }
//       res.send(users)
//    }).catch((err) => {
//       res.status(500).send()
//    })
// });

// app.get('/users', (req, res) => {
//    User.find({}).then((users) => {
//       res.send(users)
//    }).catch((err) => {
//       res.status(500).send()
//    });
// });

// app.get('/users/:id', (req, res) => {
//    const _id = req.params.id
//    User.findById(_id).then((user) => {
//       if (!user) {
//          return res.status(404).send()
//       }
//       res.send(user)

//    }).catch((err) => {
//       res.status(500).send()
//    });
// });




// app.post('/tasks', (req, res) => {
//    const task = new Task(req.body)
//    task.save().then((taskObj) => {
//       res.send(taskObj)
//    }).catch((error) => {
//       res.status(400).send(error)
//    });
// });



// const jwt = require('jsonwebtoken')

// const dowork = async ()=>{
//    const token =  jwt.sign({_id:'abc123'},"thisismycourse",{expiresIn:100})

//    console.log(token)

//    const data = jwt.verify(token,'thisismycourse')

//    console.log("data",data)

//    // token have 2 dots[before first dot--> base64 header,between 2 dots -->base64 body]
//    // header.payload or body.signature
//    //signature is to verify web token

//    //decoded body --> {"_id":"abc123","iat":1608604689} 
//    //decoded header -->{"alg":"HS256","typ":"JWT"}
// }

// // dowork()
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('5fe1cffefaed320d41b8dfe5')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     const user = await User.findById('5fe1cffcfaed320d41b8dfe3')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
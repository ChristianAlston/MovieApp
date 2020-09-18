const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const pageRoutes = require('./routes/pages')
const userRoutes = require('./routes/users')
const mongoose = require('mongoose')
const ecryption = require('mongoose-encryption')
const PORT = 4000
const app = express()
, http = require('http');
const server = http.Server(app)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
  })
const io = require('socket.io')(server)




mongoose.connect("mongodb://localhost:27017/FlixifyUsersDB", { useNewUrlParser: true })

// create blueprint for users
// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'You need a name']
//     },
//     password: String,
//     email: String,
//     watchLaterMovies: []
// })

// const User = new mongoose.model('user', userSchema)


// User.find((err, users) => {
//     if (err) {
//         console.log(err)
//     } else {
//         mongoose.connection.close()
//         console.log('Nice')
//         users.forEach(user => console.log(user.name))
//     }
// })



app.use(helmet())



app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser())
app.use(cookieParser())

app.use(express.static('css'))
app.use(express.static('images'))
app.use(express.static(__dirname + '/public'))
app.use('/peerjs', peerServer);
app.use(pageRoutes)
app.use(userRoutes)

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId);
      // messages
      socket.on('message', (message) => {
        //send message to the same room
        io.to(roomId).emit('createMessage', message)
    }); 
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

server.listen(PORT, () => {
    console.log(`Port ready on port ${PORT}`)
})
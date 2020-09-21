const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const pageRoutes = require('./routes/pages')
const mongoose = require('mongoose')
const ecryption = require('mongoose-encryption')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
require('dotenv').config()

const PORT = 4000
const app = express(), http = require('http');
const server = http.Server(app)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})
const io = require('socket.io')(server)


app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static('css'))
app.use(express.static('images'))
app.use(express.static(__dirname + '/public'))
app.use('/peerjs', peerServer);
app.use(pageRoutes)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/FlixifyUsersDB", { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    birthday: String,
    movies: Array
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model('user', userSchema)

passport.use(User.createStrategy())

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
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.get('/moviepage/:genres', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('moviepage/:genres')
    } else {
        res.redirect('/')
    }
    console.log(req.params.genres)

    request.get(nowPlayingUrl, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        console.log(parsedData)
        console.log(parsedData.results[0].genre_ids)
        res.render('moviepage', {
            parsedData: parsedData.results
        })
    })
})



app.post('/signup', (req, res, next) => {
    User.register({ username: req.body.username, email: req.body.email, birthday: req.body.birthday }, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.redirect('/signup')
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/moviepage/:genres')
                console.log(user)
            })
        }
    })
})

app.post('/', (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, (err) => {
        if (err) {
            console.log(err)
        } else {

            res.redirect('/moviepage/:genres')
        }
    })
})


server.listen(PORT, () => {
    console.log(`Port ready on port ${PORT}`)
})
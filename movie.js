const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const pageRoutes = require('./routes/pages')
const userRoutes = require('./routes/users')
const mongoose = require('mongoose')
const ecryption = require('mongoose-encryption')
// const dom = require('./domManip')
const PORT = 4000



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
app.use(pageRoutes)
app.use(userRoutes)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.listen(PORT, () => {
    console.log(`Port ready on port ${PORT}`)
})
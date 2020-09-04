const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const pageRoutes = require('./routes/pages')
const userRoutes = require('./routes/users')
const PORT = 4000


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
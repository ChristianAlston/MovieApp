const express = require('express')
const app = express()
const helmet = require('helmet')
const PORT = 3000
app.use(helmet())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('views'))

app.listen(PORT, () => {
    console.log(`Port ready on port ${PORT}`)
})
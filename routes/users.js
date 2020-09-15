const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')



router.post('/signup', (req, res, next) => {
    const userSchema = new mongoose.Schema({
        name: { type: String, required: [true, 'User does not have a name'] },
        username: String,
        email: String,
        password: String,
        birthday: String
    })

    const User = new mongoose.model('user', userSchema)

    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday
    })

    newUser.save((err) => {
        if (err) {
            console.log(err, 'There was an error adding new user to the database.')
        } else {
            console.log('New user successfully added to the database.')
            res.render('../views/moviegenres')
        }
    })
    console.log(newUser)
    User.deleteMany({}, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Users deleted cool')
        }
    })
})



router.post('/', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, validated) => {
        if (err) {
            console.log(err)
        } else {
            if (validated) {
                if (validated.password === password) {
                    res.render('../views/moviegenres')
                }
            }
        }
    })
})




module.exports = router


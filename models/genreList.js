const mongoose = require('mongoose')
const genre = mongoose.Schema({
    genreName: String
})

const genreList = mongoose.model('genreList', genre)

module.exports = genreList
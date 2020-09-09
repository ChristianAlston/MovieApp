const express = require('express')
const router = express.Router()
const request = require('request')
const helmet = require('helmet')
require('dotenv').config()

const dom = require('../domManip')
 
const apiKey = process.env.API_KEY
const apiBaseUrl = process.env.API_BASE_URL
const nowPlayingUrl = `${process.env.API_BASE_URL}${process.env.API_EXTRA}${process.env.API_KEY}`
const imageBaseUrl = process.env.IMAGE_BASE_URL
const key = process.env.KEY
const secret = process.env.SECRET_KEY

router.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", 'maxcdn.bootstrapcdn.com', 'ajax.googleapis.com'], styleSrc: ["'self'", 'fonts.googleapis.com'], imgSrc: ["'self'", 'image.tmdb.org'] } }))

router.use((req, res, next) => {
    res.locals.dom = dom
    next()
})

router.use((req, res, next) => {
    res.locals.imageBaseUrl = imageBaseUrl
    next()
})

router.get('/', (req, res) => {

    res.render('index')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/moviegenres', (req, res) => {
    res.render('moviegenres')
})

router.get('/moviepage', (req, res) => {
    request.get(nowPlayingUrl, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        console.log(parsedData)
        res.render('moviepage', {
            parsedData: parsedData.results
        })
    })

})

router.get('/movie/:id', (req, res, next) => {
    const movieID = req.params.id
    const movieUrl = `${apiBaseUrl}/movie/${movieID}?api_key=${apiKey}`
    request.get(movieUrl, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        res.render('movie', {
            parsedData
        })
    })
})

router.get('/play/:id', (req,res,next) =>{
    const movieID = req.params.id
    const ipAdd = data.ip
    const playMovie = `https://vsrequest.video/request.php?key=${key}&secret_key=${secret}&video_id=${movieID}&tmdb=0&tv=0&s=*0&ip=${ipAdd}`
    request.get('https://json.geoiplookup.io/api', (error, response, ipData) => {
        const data = JSON.parse(ipData)
        console.log(data)
    })
    request.get(playMovie, (error, response, movieAddress) => {
        const parsedData = JSON.parse(movieAddress)
        res.render('play', {
            parsedData
        })
    })
})

router.post('/search', (req, res, next) => {
    const search = encodeURI(req.body.search)
    const movieUrl = `${apiBaseUrl}/search/?query=${search}&api_key=${apiKey}`
})



router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router
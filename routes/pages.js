const express = require('express')
const router = express.Router()
const request = require('request')
const helmet = require('helmet')

const dom = require('../domManip')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8'
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

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

router.post('/search', (req, res, next) => {
    const search = encodeURI(req.body.search)
    const movieUrl = `${apiBaseUrl}/search/?query=${search}&api_key=${apiKey}`
})



router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router
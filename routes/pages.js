const express = require('express')
const router = express.Router()
const request = require('request')
const helmet = require('helmet')
const { response } = require('express')
require('dotenv').config()



const apiKey = process.env.API_KEY
const apiBaseUrl = process.env.API_BASE_URL
const nowPlayingUrl = `${process.env.API_BASE_URL}${process.env.API_EXTRA}${process.env.API_KEY}`
const imageBaseUrl = process.env.IMAGE_BASE_URL
const key = process.env.KEY
const secret = process.env.SECRET_KEY

router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        imgSrc: ["'self'", "https://image.tmdb.org"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        blockAllMixedContent: [],
        upgradeInsecureRequests: [],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"]
    }
}))

// router.use((req, res, next) => {
//     res.locals.dom = dom
//     next()
// })

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

router.get('/moviepage/:genres', (req, res) => {
    console.log(req.params.genres)
    // request.get(movieStuff, (error, response, movieData) => {
    //     const genre = JSON.parse(movieData)
    //     console.log(genre)

    // })
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
            parsedData, movieID
        })
    })
})

router.get('/play/:id', (req, res, next) => {
    const movieID = req.params.id

    request.get('http://ip6only.me/api/', (error, response, ipData) => {
        const data = ipData.substring(5, 42)
        const playMovie = `https://streamvideo.link/getvideo?key=${key}&video_id=${movieID}&tmdb=1`
        // const playMovie = `https://vsrequest.video/request.php?key=${key}&secret_key=${secret}&video_id=${movieID}&tmdb=1&tv=0&s=*0&ip=${data}`
        console.log(playMovie)
        request.get(playMovie, (error, response, movieAddress) => {
            console.log(movieAddress)
            res.render('play', {
                movieAddress: movieAddress
            })
        })
    })
    // const movieAddress =

})

router.post('/search', (req, res, next) => {
    const search = encodeURI(req.body.search)
    const movieUrl = `${apiBaseUrl}/search/?query=${search}&api_key=${apiKey}`
})



router.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = router
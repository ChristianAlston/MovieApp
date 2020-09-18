const express = require('express')
const router = express.Router()
const request = require('request')
const helmet = require('helmet')
const { response } = require('express')
require('dotenv').config()
const app = express()
const { v4: uuidV4 } = require('uuid')



const apiKey = process.env.API_KEY
const apiBaseUrl = process.env.API_BASE_URL
const nowPlayingUrl = `${process.env.API_BASE_URL}${process.env.API_EXTRA}${process.env.API_KEY}`
const imageBaseUrl = process.env.IMAGE_BASE_URL
const key = process.env.KEY
const secret = process.env.SECRET_KEY

router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'",
        "https://streamwatching.today", 
        "https://oload.party/video/",
        ],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        imgSrc: ["'self'", "https://image.tmdb.org"],
        scriptSrc: ["'self'", "'unsafe-inline'",  
        "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
        "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js",
        'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
        "https://kit.fontawesome.com/c939d0e917.js",
        ],
        connectSrc: ["'self'", "ws://localhost:4000"],
        blockAllMixedContent: [],
        upgradeInsecureRequests: [],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"]
    }
}))

router.get('/play/:id', (req,res,next) => {
    const movieID = req.params.id
    res.redirect(`/room/${uuidV4()}/${movieID}`)
})

app.set('view engine', 'ejs')
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
        console.log(parsedData.results[0].genre_ids)
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

router.get('/room/:room/:id', (req, res, next) => {
    const movieID = req.params.id
    const roomId = req.params.room
    request.get('http://v6.ipv6-test.com/api/myip.php', (error, response, ipData) => {
        const data = ipData
        // const playMovie = `https://streamvideo.link/getvideo?key=${key}&video_id=${movieID}&tmdb=1`
        const playMovie = `https://vsrequest.video/request.php?key=${key}&secret_key=${secret}&video_id=${movieID}&tmdb=1&tv=0&s=*0&ip=${data}`
        request.get(playMovie, (error, response, movieAddress) => {
            res.render('room', {
                movieAddress: movieAddress,
                roomId: roomId
            })
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
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
const popularMovies = `${process.env.API_BASE_URL}${process.env.API_EXTRA2}${process.env.API_KEY}`
const upcoming = `${process.env.API_BASE_URL}${process.env.API_EXTRA3}${process.env.API_KEY}`
const topRated = `${process.env.API_BASE_URL}${process.env.API_EXTRA4}${process.env.API_KEY}`
const imageBaseUrl = process.env.IMAGE_BASE_URL
const key = process.env.KEY
const secret = process.env.SECRET_KEY



app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'",
            "https://streamwatching.today",
            "https://oload.party/video/",
            "ws://",
            "wss://"
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
        connectSrc: ["'self'", "ws://" + "flixify.herokuapp.com", "wss://" + "flixify.herokuapp.com"],
        blockAllMixedContent: [],
        upgradeInsecureRequests: [],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"]
    }
}))

app.get('/play/:id', (req, res, next) => {
    const movieID = req.params.id
    res.redirect(`/room/${uuidV4()}/${movieID}`)
})

app.set('view engine', 'ejs')

app.use((req, res, next) => {
    res.locals.imageBaseUrl = imageBaseUrl
    next()
})


app.get('/moviepage/:genres', (req, res) => {
    console.log(req.params.genres)
    request.get(nowPlayingUrl, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        request.get(upcoming, (error, response, movieData) => {
            const parsedData3 = JSON.parse(movieData)
            request.get(topRated, (error, response, movieData) => {
                const parsedData4 = JSON.parse(movieData)
                request.get(popularMovies, (error, response, movieData) => {
                    const parsedData2 = JSON.parse(movieData)
                    console.log(parsedData2)
                    console.log(parsedData2.results[0].genre_ids)
                    res.render('moviepage', {
                        parsedData: parsedData.results,
                        parsedData2: parsedData2.results,
                        parsedData3: parsedData3.results,
                        parsedData4: parsedData4.results
                    })
                })
            })
        })
    })
})

app.get('/movie/:id', (req, res, next) => {
    const movieID = req.params.id
    const movieUrl = `${apiBaseUrl}/movie/${movieID}?api_key=${apiKey}`
    request.get(movieUrl, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        res.render('movie', {
            parsedData, movieID
        })
    })
})

app.get('/room/:room/:id', (req, res, next) => {
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

app.get('/search', (req, res) => {
    res.render('search')
})

app.post('/moviepage/:genres', (req, res, next) => {
    const search = encodeURI(req.body.search)
    const searchString = `${apiBaseUrl}/search/movie?query=${search}&api_key=${apiKey}`
    request.get(searchString, (error, response, movieData) => {
        const parsedData = JSON.parse(movieData)
        res.render('search', {
            parsedData: parsedData.results
        })
    })
})


module.exports = app
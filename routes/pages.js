const express = require('express')
const app = express()
const request = require('request')
const helmet = require('helmet')
const { response } = require('express')
require('dotenv').config()



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

app.use((req, res, next) => {
    res.locals.imageBaseUrl = imageBaseUrl
    next()
})


app.get('/moviepage/:genres', (req, res) => {
    console.log(req.params.genres)
    // request.get(movieStuff, (error, response, movieData) => {
    //     const genre = JSON.parse(movieData)
    //     console.log(genre)

    // })

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

app.get('/play/:id', (req, res, next) => {
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

app.post('/search', (req, res, next) => {
    const search = encodeURI(req.body.search)
    const movieUrl = `${apiBaseUrl}/search/?query=${search}&api_key=${apiKey}`
})



app.get('/profile', (req, res) => {
    res.render('profile')
})

module.exports = app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

// allows the app to use the module body-parser in order to parse json files. 
app.use(bodyParser.json())

//This means that this is a route. This route is going to the homepage and the res is what you might call the result of what you requested. You request the homepage, you'll get whatever data is on the homepage. 
app.get('/', (req, res) => {
    res.send('Yo');
})

// /movies/action/year/2019
// everything with a colon in front of it is what will be filtered and used as a dynamic parameter. 
// So you're searching through the movies, you're choosing your genre which you have control over, you're searching through the year, and then plugging in which year you want to search in.
// Think of this as a filter to find whichever genre you have a taste for.
app.get('/movies/:genre/year/:year', (req, res) => {
    // when you console.log the params entered in in the browser, youll get exactly what you typed in which in this case is going to be action and 2019. the req is what you're asking to see, the response is the result of what you asked for.
    console.log(req.params.genre)
    console.log(req.params.year)
    res.send('movies');
})

app.get('/movie', (req, res) => {
    // With this you are able to see what query strings you have in the browser. For ex: whatever is filtered is what is going to be shown for the results.
    res.send('Movies')
    console.log(req.query.sort);
    console.log(req.query.movieGenre);
})

app.get('/moviechoices', (req, res) => {
    // this will send back a json file when you say res.json. 
    // You are saying you want to send back a result of the movie in json
    // let movie = {
    //     title: 'Avengers',
    //     year: '2012',
    //     genre: 'action'
    // }
    // res.json(movie);
    let database = [{
            title: 'Avengers',
            year: '2012',
            genre: 'action'
        },
        {
            title: 'Interstellar',
            year: '2014',
            genre: 'sci-fi'
        },
        {
            title: 'Invisible Man',
            year: '2020',
            genre: 'Mystery'
        }
    ]

    res.json(database);
})

// to post means to send it to a database to be stored for later on access.
app.get('/movies', (req, res) => {
    res.send('Login page for example')

})
// if you are posting some kind of data such as filling out a form, what will be run is this function here
// this will below means that you are accessing the requests' parameters which will be the title and year of the movie aka (body)
app.post('/movies', (req, res) => {
    let title = req.body.title;
    let year = req.body.year;
    let genre = req.body.genre;
    console.log(title, year, genre);
    res.send('Got it')
})


app.listen(PORT, () => {
    console.log('Server running on port 3000');
})
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mustacheExpress = require("mustache-express");
const PORT = 5000;

// parse json data so that the browser can read it
app.use(bodyParser.json());

// this combines  the path module with whatever directory name you're in concatenated with the folder.
const VIEWS_PATH = path.join(__dirname, "/views");

// Using other files
app.use(express.static("css"));
app.use(express.static("images"));

// what you will be viewing the files in
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));

// you are telling the computer where you want to grab your files from which is from the views folder. your views are coming from the view folder.
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

// This line below allows you to use body parser in order to view url encoded values and extended: false means you are not allowed to send nested form values.
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// this will render the page you requested and all you need is the page name
app.get("/", (req, res) => {
    // right here you are rendering all key value pairs inside of the user object template
    let user = {
        name: "Christian",
        age: "24",
    };
    res.render("index", user);
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/moviegenres", (req, res) => {
    res.render("moviegenres");
});

app.get("/moviepage", (req, res) => {
    res.render("moviepage");
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

// So whenever you are posting something, you need to specify that you are posting the data from whatever element under a specific name. Whatever you wrote for the name = "" attribute in the input element, is what you would use here so for ex: if you used fullname in the html page, you would use req.body.fullname
app.post("/signup", (req, res) => {
    let nameOf = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let birthday = req.body.birthday;
    console.log(nameOf, email, password, username, birthday);
    res.status(200).send("Good to go");
});

app.get("/users", (req, res) => {
    let users = [{
            name: "yes",
            age: 24,
        },
        {
            name: "haha",
            age: 50,
        },
        {
            name: "nope",
            age: 10,
        },
    ];

    // right here you are returning the users objects and the value of users which is the 3 users you see above
    users = [];
    res.render("users", {
        users: users,
    });
});

// // acquiring data and sending back the response of the data
// app.get('/', (req, res) => {
//     let database = [{
//             title: 'avengers',
//             year: '2012',
//             genre: 'action'
//         },
//         {
//             title: 'invisible man',
//             year: '2020',
//             genre: 'mystery'
//         },
//         {
//             title: 'interstellar',
//             year: '2014',
//             genre: 'sci-fi'
//         }
//     ]
//     res.send(database);
// })
// // sending info to the backend database
// app.post('/movies', (req, res) => {
//     let title = req.body.title;
//     let year = req.body.year;
//     let genre = req.body.genre;
//     console.log(title, year, genre)
//     res.json('check the console for your results')
// })

// Toggle menu show/hide



app.listen(PORT, () => {
    console.log(`server ready on port ${PORT}`);
});
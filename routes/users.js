const express = require('express')
const router = express.Router()

// instead of app. you would use router. to tell your machine how to route. 
router.post('/signup', (req, res) => {
    let user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday
    }
    res.render('signup', user)
})

// router.use only applies to THIS router and NOT the main configuration file. in other words, the main file does not know about router.use and therefore whatever is written here will not apply to the main file. 

// // when you go to this url you will run all the functionality within 
// // this will render the page you requested and all you need is the page name
// router.get("/", (req, res) => {
//     // right here you are rendering all key value pairs inside of the user object template
//     let user = {
//         name: "Christian",
//         age: "24",
//     };
//     res.render("index", user);
// });

// // if you want to use this in another file, you will need to export it here and then import it in the file you are exporting to 
module.exports = router


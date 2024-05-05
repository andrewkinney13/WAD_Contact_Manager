// Andrew Kinney
// Professor Frees
// Web Application Development
// Project 3: Contact List w/ CSS
// 4.8.2024

// Import express
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Creates database 
const Database = require('./wrapper');
const db = new Database();
db.initialize();

// App will be used to add middleware when requests are made
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json())

// Add db to the response
app.use((req, res, next) => {
    req.db = db;
    next();
})

// Initialize session
app.use(session({
    secret: 'andrewproject2',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// Saves session data if user is logged in
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            id: req.session.user.id,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name
        }
    }
    next();
})

// Use PUG for html
app.set('view engine', 'pug');

// Assign routes
app.use('/', require('./routes/home'));
app.use('/', require('./routes/accounts'));
app.use('/', require('./routes/contacts'));

// Allow loading the css file 
app.use(express.static(path.join(__dirname, 'public')));
app.use("/:id", express.static(path.join(__dirname, 'public')));

// Listen on port 8080
app.listen(8080, () => {
    console.log('Server is running  on port 8080')
});



// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var session = require ('express-session')
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();


var mysql = require('mysql2');

// Create the express application object
const app = express()
const port = 8000

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))


// Define the database connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')


app.use(expressSanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.shopData = {shopName: "Better Fitness"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

const exerciseChart = require('./exerciseChart')
app.use('/exerciseChart', exerciseChart)

const ImageFolder = require('./images')
app.use('/images', ImageFolder)

const trackerRoutes = require('./routes/tracker')
app.use('/tracker', trackerRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
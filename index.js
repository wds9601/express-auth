//Required node modules
require('dotenv').config() //provide access to variables inside .env file
let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')

//Declare express app variable
let app = express()

//Set up middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())  //Depends on session; must come after it.  ORDER MATTERS!

//Custom middleware: add variables to locals for each page
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    next()
})

//Add any controllers we have
app.use('/auth', require('./controllers/auth'))

//Add home or catch-all routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('*', (req, res) => {
    res.render('error404')
})

app.listen(process.env.PORT || 3000, () => { //will look in .env file for a port, if there isnt one, will use 3000.  would write PORT=#### in .env
    console.log('You are connected!')
})
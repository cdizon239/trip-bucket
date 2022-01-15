//  DEPENDENCIES
require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
// const mapboxgl = require('mapbox-gl')
const tripController = require('./controllers/tripController')
const sessionsController = require('./controllers/sessionsController')
const methodOverride = require('method-override')
const session = require('express-session')
const nodemailer = require('nodemailer')
const emailReminder = require('./utils/email')


// MIDDLEWARES
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', './layouts/layout.ejs')
app.set('port', process.env.PORT || 3000)
app.use(express.static('frontend'))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set('trust proxy', 1);
app.use(session({
    cookie: {
        secure: true,
        maxAge: 6000
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

//  CUSTOM MIDDLEWARES

//  session middleware
app.use((req,res,next) => {
    res.locals.username = req.session.username
    res.locals.useremail = req.session.useremail
    res.locals.loggedIn = req.session.loggedIn
    res.locals.userId = req.session.userId
    next()
})

app.use((req,res,next) => {
    res.locals.message = req.session.message
    req.session.message = null
    //  after each request, we reset the message
    next()
})

//  middleware, require auth
const authRequired = (req, res, next) => {
    if (loggedIn) {
        next()
    } else {
        res.redirect('/sessions/login')
    }
}


app.use('/sessions', sessionsController)
app.use('/trips', tripController)


app.get('/', (req, res) => {
    res.render('home/home.ejs')
})

// emailReminder()


app.listen(app.get('port'), () => {
    console.log(`Magic is working in port ${app.get('port')}`)
})
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


// MIDDLEWARES
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', './layouts/layout.ejs')
app.set('port', process.env.PORT || 8000)
app.use(express.static('frontend'))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

//  CUSTOM MIDDLEWARE
app.use((req,res,next) => {
    res.locals.username = req.session.username
    res.locals.loggedIn = req.session.loggedIn
    next()
})

app.use((req,res,next) => {
    res.locals.message = req.session.message
    req.session.message = ""
    //  after each request, we reset the message
    next()
})


app.use('/trips', tripController)
app.use('/sessions', sessionsController)


app.get('/', (req, res) => {
    res.render('home/home.ejs')
})

app.listen(app.get('port'), () => {
    console.log(`Magic is working in port ${app.get('port')}`)
})
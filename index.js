//  DEPENDENCIES
require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
// const mapboxgl = require('mapbox-gl')

// MIDDLEWARES
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 8000)
app.use(express.static('app'))



app.get('/', (req, res) => {
    res.render('index')
})

app.listen(app.get('port'), () => {
    console.log(`Magic is working in port ${app.get('port')}`)
})
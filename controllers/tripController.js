const express = require('express')
const router = express.Router()
const Trip = require('../models/trip')

//  MIDDLEWARE to gate features that need log in
const authRequired = (req,res,next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect('/sessions/login')
    }
}

//  INDEX
router.get('/', (req, res) => {
    Trip.find({}, (err, trips) => {
        res.render('index', {trips: JSON.stringify(trips)})
    })
})

//  NEW
router.get('/new', (req, res) => {
    res.render('new')
})

//  SHOW
router.get('/:id', (req, res) => {
    Trip.findById(req.params.id, (err, trip) => {
        res.render('show', {layout: './layouts/sidebar', trip: JSON.stringify(trip)})
    })
})

//  POST to create new trip
router.post('/', (req, res) => {
    console.log(req.body)
    Trip.create(req.body, (err, createdTrip) => {
        // res.render('/trips')
        res.render('show', {layout: './layouts/sidebar', trip: JSON.stringify(createdTrip)})
    })
})

//  DELETE
router.delete('/:id', (req,res)=>{
    Trip.findByIdAndRemove(req.params.id, (err, deletedTrip) => {
        res.redirect('/trips')    
    })
})

router.get('/:id/edit', (req,res) => {
    Trip.findById(req.params.id, (err, trip) => {
        res.render('edit', {layout: './layouts/sidebar', trip: JSON.stringify(trip)})
    })
})

//  Update places to visit of a given trip: Add a place
router.patch('/:id/addPlace', (req, res) => {
    console.log(req.body);
    let {lat, long, title} = req.body
    Trip.findByIdAndUpdate(req.params.id, { $push: {places_to_visit: {lat, long, title}}},
            {new: true}, (err, updatedTrip) => {
                console.log(updatedTrip)
                res.redirect(`/trips/${updatedTrip._id}`)
            }
    )
})

//  Update places to visit of a given trip: Remove a place
router.patch('/:id/removePlace', (req, res) => {
    console.log(req.params.id);
    let title = req.body
    Trip.findByIdAndUpdate(req.params.id, { $pull: { places_to_visit: title }},
            {new: true}, (err, updatedTrip) => {
                console.log(updatedTrip)
                res.redirect(`/trips/${updatedTrip.id}`)
            }
    )
})

//  UPDATE entire entry
router.put('/:id', (req, res) =>{
    Trip.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedModel) => {
        res.redirect('/trips')
    })
})


module.exports = router
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
        res.render('show', {trip})
    })
})

//  POST to create new trip
router.post('/', (req, res) => {
    console.log(req.body)
    Trip.create(req.body, (err, createdTrip) => {
        res.redirect('/trips')
    })
})

//  DELETE
router.delete('/:id', (req,res)=>{
    Trip.findByIdAndRemove(req.params.id, (err, deletedTrip) => {
        res.redirect('/trips')    
    })
})

//  UPDATE
router.put('/:id', (req, res) =>{
    Trip.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedModel) => {
        res.redirect('/trips')
    })
})

router.get('/:id/edit', (req,res) => {
    Trip.findById(req.params.id, (err, trip) => {
        res.render('edit', {trip})
    })
})

module.exports = router
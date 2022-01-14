const express = require('express')
const ObjectID = require('mongodb').ObjectID
const router = express.Router()
const Trip = require('../models/trip')
const User = require('../models/user')

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
    let suggestedTrips
    Trip.find({owner: {$exists: false}}, (err, trips) => {
        suggestedTrips = trips
        console.log(suggestedTrips)
    })
    let tripsByUser = User.findById(req.session.userId, (err, user) => {
        Trip.find({owner: ObjectID(req.session.userId)}, (err, trips) => {
            res.render('index', {trips: JSON.stringify(trips), suggestedTrips: JSON.stringify(suggestedTrips)})
        })
    })    
})

//  NEW
router.get('/new', authRequired, (req, res) => {
    res.render('new')
})

//  SHOW
//  show a "Suggested Trip" page
router.get('/toAdd/:id',  (req, res) => {
    Trip.findById(req.params.id, (err, trip) => {
        res.render('showToAdd', {layout: './layouts/sidebar', trip: JSON.stringify(trip)})
    })
})


//  show "Your Trips" page
router.get('/:id',  (req, res) => {
    Trip.findById(req.params.id, (err, trip) => {
        let newStart = trip.start_date ? trip.start_date.toISOString().split('T')[0] : ''
        let newEnd = trip.end_date ? trip.end_date.toISOString().split('T')[0]: ''
        res.render('show', {layout: './layouts/sidebar', trip: JSON.stringify(trip), start_date: newStart, end_date: newEnd })
    })
})

//  POST to create new trip
router.post('/', authRequired, (req, res) => {
    User.findById(req.session.userId, (err, user) => {

        let newTrip = {
            ...req.body,
            owner: ObjectID(req.session.userId)
        }
        //  create
        Trip.create(newTrip, (err, createdTrip) => {
            let newStart = !!createdTrip.start_date ? createdTrip.start_date.toISOString().split('T')[0] : null
            let newEnd = !!createdTrip.end_date ? createdTrip.end_date.toISOString().split('T')[0] : null
            res.render('show', {layout: './layouts/sidebar', trip: JSON.stringify(createdTrip), start_date: newStart, end_date: newEnd})
        })

    })
    
})

router.post('/addSuggestedTrip', (req, res) => {
    Trip.findById(req.body.suggestedTripId, (err, trip) => {
        trip._id = ObjectID()
        trip.owner = ObjectID(req.session.userId)
        trip.isNew = true
        trip.save()
        res.redirect('/trips')
    })
    
})

//  DELETE
router.delete('/:id', (req,res)=>{
    User.findById(req.session.userId, (err, user) => {
        Trip.findByIdAndRemove(req.params.id, (err, deletedTrip) => {
            res.redirect('/trips')    
        })
    })
})

router.get('/:id/edit', (req,res) => {
    Trip.findById(req.params.id, (err, trip) => {
        let newStart = trip.start_date ? trip.start_date.toISOString().split('T')[0] : ''
        let newEnd = trip.end_date ? trip.end_date.toISOString().split('T')[0]: ''
        res.render('edit', {layout: './layouts/sidebar', trip: JSON.stringify(trip), start_date: newStart, end_date: newEnd })
    })

})

//  Update places to visit of a given trip: Add a place
router.patch('/:id/addPlace', (req, res) => {
    let {lat, long, title, place_name} = req.body
    Trip.findByIdAndUpdate(req.params.id, { $push: {places_to_visit: {lat, long, title, place_name}}},
            {new: true}, (err, updatedTrip) => {
                res.redirect(`/trips/${updatedTrip._id}`)
    })
})

//  Update places to visit of a given trip: Remove a place
router.patch('/:id/removePlace', (req, res) => {
    let place_id = ObjectID(req.body.place_id)
    Trip.findByIdAndUpdate(req.params.id, { $pull: { places_to_visit: {_id: place_id} }},
            {new: true}, (err, updatedTrip) => {
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
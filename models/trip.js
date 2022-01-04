// CONNECT
const mongoose = require('../db/connection')
// MAKE SCHEMA
const tripSchema = new mongoose.Schema({
    name: String,
    start_date: Date,
    end_date: Date,
    cities_to_visit: Array,
    places_to_visit_coordinates: [{lat: Number, long: Number}],
    places_to_visit_names: Array
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})
// MAKE MODEL
const Trip = mongoose.model('Trip', tripSchema)
// EXPORT
module.exports = Trip
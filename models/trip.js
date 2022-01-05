// CONNECT
const mongoose = require('../db/connection')
// MAKE SCHEMA
const tripSchema = new mongoose.Schema({
    name: String,
    start_date: String,
    end_date: String,
    cities_to_visit: Array,
    places_to_visit: [{
        lat: Number,
        long: Number,
        title: String,
        rating: Number,
        description: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})
// MAKE MODEL
const Trip = mongoose.model('Trip', tripSchema)
// EXPORT
module.exports = Trip
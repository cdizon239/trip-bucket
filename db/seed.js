require('dotenv').config()

const mongoose = require('./connection')
const Trip = require('../models/trip')
const tripSeeds = require('./seedData.json')

Trip.deleteMany({})
.then(() => {
    return Trip.insertMany(tripSeeds)
})
.then(data => {
    console.log(data)
})
.catch((err) => {
    console.log(err)
})
.finally(()=> {
    process.exit()
})
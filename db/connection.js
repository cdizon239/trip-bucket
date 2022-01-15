// DEPENDENCY
const mongoose = require('mongoose')

//  CONNECT
const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost:27017/trip-bucket'

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((instance) => 
console.log(`Connected to db: ${instance.connections[0].name}`))
.catch((err) => console.log('Connection failed', err))

// EXPORT
module.exports = mongoose



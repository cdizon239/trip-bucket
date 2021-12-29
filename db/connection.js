// DEPENDENCY
const mongoose = require('mongoose')

//  CONNECT

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((instance) => 
console.log(`Connected to db: ${instance.connections[0].name}`))
.catch((err) => console.log('Connection failed', error))

// EXPORT
module.exports = mongoose



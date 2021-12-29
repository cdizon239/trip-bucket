const mongoose = require('../db/connection')

const UserSchema = new mongoose.Schema({
    email: String,
    name: String
})

// Instantiate a model
const User = mongoose.model('User', UserSchema);

module.exports = User;
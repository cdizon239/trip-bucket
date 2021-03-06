const mongoose = require('../db/connection')

const UserSchema = new mongoose.Schema({
    useremail: {
        type: String,
        unique: true,
        require: true,
    },
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ]
})

// Instantiate a model
const User = mongoose.model('User', UserSchema);

module.exports = User;
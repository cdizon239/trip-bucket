//  CONFIG DEPENDENCIES
const express = require('express')
const router = express.Router()
const User= require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.send('Sessions controller works')
})

//  Create an account page
router.get('/register', (req, res) => {
    res.render('sessions/register.ejs')
})

//  POST: create an account
router.post('/register', async (req, res, next) => {
    try {
        if (req.body.password === req.body.verifyPassword) {
            //  passwords must match
            const usernameToRegister = req.body.usernameToRegister
            const userExists = await User.findOne({ username: usernameToRegister })
            if (userExists) {
                res.send('Username already taken')
            } else {
                //  encrypt the password with bcrypt
                const salt = bcrypt.genSaltSync(11)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt)

                //  reassign to only store hashedPassword
                req.body.password = hashedPassword
                
                const createdUser = await User.create(req.body)
                req.session.username = createdUser.username
                req.session.loggedin = true
                
                res.redirect('/trips')
            }
        }
    } catch (err) {
        next(err)
    }
})

router.get('/login', (req, res) => {
    res.render('sessions/login.ejs')
})

router.post('/login', async (req, res, next) => {
    //  asynce await best practice to wrap in try catch
    try {
        const userToLogin = await User.findOne({ username: req.body.username})

        if (userToLogin) {
            //  we need to check if the passwords match
            //  we do this with bcrypt.compareSync
            const validPassword = bcrypt.compareSync(req.body.password, userToLogin.password)

            //  compareSync compares the first cleartext argument to the encrypted second argument
            //  returns a boolean, true if they match, otherwise false
            if (validPassword) {
                req.session.username = userToLogin.username
                req.session.loggedIn = true
                res.redirect('/trips')
            } else {
                req.session.message = "Invalid username or password"
                res.redirect('/sessions/login')
            }
        } else {
            req.session.message = "Invalid username or password"
            res.redirect('/sessions/login')
        }
    } catch (err) {
        next(err)
    }
})

router.get('/logout', (req, res) => {

    req.session.destroy()
    res.redirect('/sessions/login')
})

module.exports = router
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
            const usernameToRegister = req.body.username
            const useremailToRegister = req.body.useremail
            const usernameExists = await User.findOne({ username: usernameToRegister })
            const useremailExists = await User.findOne({ useremail: useremailToRegister })

            if (usernameExists) {
                req.session.message = "Username already taken"
                console.log(req.session.message)
                res.redirect('/sessions/register')
            } else if (useremailExists) {
                req.session.message = "Useremail already registered"
                console.log(req.session.message)
                res.redirect('/sessions/register')
            }
            else {
                //  encrypt the password with bcrypt
                const salt = bcrypt.genSaltSync(11)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt)

                //  reassign to only store hashedPassword
                req.body.password = hashedPassword

                let {useremail, username, password} = req.body
                
                const createdUser = await User.create({useremail, username, password})
                req.session.username = createdUser.username
                req.session.loggedIn = true
                req.session.useremail = createdUser.useremail
                
                res.redirect('/trips')
            }
        } else {
            req.session.message = "Passwords must match"
            console.log(req.session.message)

            res.redirect('/sessions/register')
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
    res.redirect('/trips')
})

module.exports = router
require('dotenv').config()

const Trip = require('../models/trip')
const User = require('../models/user')
const ObjectID = require('mongodb').ObjectID
const nodemailer = require('nodemailer')    

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
})


function emailReminder() {
    User.find({}, {useremail: 1}, (err, users) => {
        
        //  get date 30 days from today
        let reminderDate = new Date()
        reminderDate.setDate(reminderDate.getDate() + 30)
        reminderDate.setUTCHours(0,0,0,0)

        console.log(reminderDate)

        //  for each user , look at trip/s that will start 30 days from today to remind them abut this trip they created
        
        users.forEach((user) => {

            Trip.find({$and: [{owner: ObjectID(user.id)},{start_date: reminderDate}]}, (err, trips) => {
                console.log(trips)
                if (trips.length > 0) { 
                    // let tripNames = trips.map(trip => trip.name)  
                                      
                    const mailData = {
                        from: 'TripBucket',
                        to: `${user.useremail}`,
                        subject: 'Book reservations for your upcoming trip!',
                        html: `<h1> TripBucket </h1>
                        <img src="../public/images/palawan.jpg" alt="trip bucket logo">
                        <h3> Reminder: you have a trip coming up in 30 days...</h3>`
                    }

                    transporter.sendMail(mailData, (err, info) => {
                        if (err) {
                            return console.log(err)
                        }
                    })
                }
            })
        })
    })
}

emailReminder()
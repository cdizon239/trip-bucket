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
                if (trips.length > 0) { 
                    let tripNames = trips.map(trip => trip.name)
                    console.log(tripNames);       
                    const mailData = {
                        from: 'TripBucket',
                        to: `${user.useremail}`,
                        subject: 'REMINDER: Book reservations for your upcoming trip in 30 days',
                        html: `<h1> TripBucket </h1>
                        <h3> Reminder: you have a trip coming up in 30 days...</h3>
                        <p> Dear TripBucket Traveler, </p>
                        <p> This is a friendly reminder that you an upcoming trip scheduled in 30 days. <br> Make sure you book reservations for flights, hotels, and places you intend to visit.<br>This will help you maximize your time enjoying and living your best life during your trip.</p>
                        
                        <p>Cheers,
                        <br>The TripBucket Team</p>
                        `
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
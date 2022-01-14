const Trip = require('../models/trip')
const nodemailer = require('nodemailer')


function emailReminder(res) {

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

    const mailData = {
        from: 'coleencharmille@gmail.com',
        to: 'coleencharmille@gmail.com',
        subject: 'Book reservations for your upcoming trip!',
        text: 'email flow test',
        html: '<h1> Testing if I could send an email on nodemailer </h1>'
    }

    transporter.sendMail(mailData, (err, info) => {
        if (err) {
            return console.log(err)
        }
        res.status(200).send({message: "Mail send", message_id: info.messageId })

    })

}

module.exports = emailReminder
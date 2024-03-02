const config = require('../config');
const nodemailer = require('nodemailer');
const email = config.email;
const pass = config.pass;

// Create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
});

function sendEmail(recipient, subject, message) {
    // Email details
    const mailOptions = {
        from: 'aitzhanulyabylaikhan@gmail.com',
        to: recipient,
        subject: subject,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = sendEmail;
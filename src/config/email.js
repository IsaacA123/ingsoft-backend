const nodemailer = require('nodemailer');
require('dotenv').config();
const user = process.env.EMAIL;
const password = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: user,
        pass: password
    }
});

async function sendEmail(client, subject, body) {
    const mailOptions = {
        from: user,
        to: client,
        subject: subject,
        html: body
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
}

module.exports =  sendEmail;

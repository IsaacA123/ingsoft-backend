const nodemailer = require('nodemailer');
const db = require('./db'); 
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.CODES_EMAIL,
        pass: process.env.CODES_PASS 
    }
});

async function sendVerificationEmail(email) {
    const expirationDate = new Date(Date.now() + 3600000); // 1 hora de expiración
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); //código de 4 digitos
    console.log("CODIGO: ", verificationCode);

    const mailOptions = {
        from:  process.env.CODES_EMAIL,
        to: email,
        subject: 'Codigo de verificación.',
        html: `
            <h2>¡Bienvenido! Al sistema de prestamos de portatiles 💻</h2>
            <p>Tu código de verificación es: <strong style="color: blue;">${verificationCode}</strong>.</p>
            <p>Este código expira en 1 hora.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        await db.execute(
            'INSERT INTO verification_codes (email, verification_code, expiration) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE verification_code = ?, expiration = ?',
            [email, verificationCode, expirationDate, verificationCode, expirationDate]
        );

        return { verificationCode, expirationDate };
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw error;
    }
}

async function verifyCode(email, code) {
    const [rows] = await db.execute('SELECT verification_code, expiration FROM verification_codes WHERE email = ?', [email]);

    if (rows.length === 0) {
        return false;
    }

    for (const row of rows) {
        const { verification_code, expiration } = row;

        if (code === verification_code && new Date() <= new Date(expiration)) {
            await db.execute('DELETE FROM verification_codes WHERE email = ?', [email]);
            return true;
        }
    }

    return false;
}



module.exports = { sendVerificationEmail, verifyCode };

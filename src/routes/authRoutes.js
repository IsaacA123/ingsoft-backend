const express = require('express');
const authRoutes = express.Router();
const { sendCodeRegister, verifyCode, registerStudent, login, logout, sendCodeRecovery, resetPassword} = require('../controllers/authController');


// registro (solo para registrar estudiantes)
authRoutes.post('/register/send-code', sendCodeRegister);
authRoutes.post('/register/', registerStudent);

// inicio de sesión
authRoutes.post('/login', login);

// cierre de sesión
authRoutes.post('/logout', logout);

// recuperar contraseña
authRoutes.post('/recovery/send-code', sendCodeRecovery);
authRoutes.post('/recovery/reset-password', resetPassword);

authRoutes.post('/verify-code', verifyCode);

 
module.exports = authRoutes;

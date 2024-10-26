const express = require('express');
const router = express.Router();
const { sendCode, registerStudent, login } = require('../controllers/authController');


//registro (solo para registrar estudiantes)
router.post('/send-code', sendCode);
router.post('/register-student', registerStudent);
//inicio sesión
router.post('/login', login);

module.exports = router;

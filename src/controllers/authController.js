const User = require('../models/User');
const sendEmail = require('../services/email');
const VerificationCode = require('../services/verificationCodes');
const bcrypt = require('bcryptjs');
const { validateUser, validateEmail } = require("../utils/validator");
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const UserDTO = require('../dtos/UserDto');
require('dotenv').config();

exports.sendCodeRegister = async (req, res) => {
    const { email } = req.body;

    try {
        const { error } = validateEmail(email);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return responseHandler(res, 409, "EMAIL_ALREADY_REGISTERED", "El correo electrónico ya está registrado, intente con otro.");
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString(); // código de 4 dígitos
        const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de expiración
        await VerificationCode.createCode(email, code, expiration);
        await sendEmail(
            email,
            "Código de verificación.",
            `
      <h2>¡Bienvenido! Al sistema de préstamos de portátiles 💻</h2>
      <p>Tu código de verificación es: <strong style="color: blue;">${code}</strong>.</p>
      <p>Este código expira en 1 hora a las ${expiration}</p>
      `
        );

        return responseHandler(res, 200, "CODE_SENT", "Código de verificación enviado al correo. Verifica tu correo para continuar.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error en el envío del código.");
    }
};

exports.sendCodeRecovery = async (req, res) => {
    const { email } = req.body;

    try {
        const { error } = validateEmail(email);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const existingUser = await User.findByEmail(email);
        if (!existingUser) {
            return responseHandler(res, 409, "EMAIL_NOT_FOUND", "Este correo no está registrado en nuestra base de datos.");
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString(); // código de 4 dígitos
        const expiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos de expiración
        await VerificationCode.createCode(email, code, expiration);
        await sendEmail(
            email,
            "Recuperar contraseña.",
            `
      <h2>¡Hola! ¿Estás tratando de cambiar tu contraseña? 🤔</h2>
      <p>Si no es así, ignora este mensaje.</p>
      <br>
      <p>Tu código de verificación es: <strong style="color: blue;">${code}</strong>.</p>
      <p>Este código expira en 30 minutos a las ${expiration}</p>
      `
        );

        return responseHandler(res, 200, "CODE_SENT", "Código de verificación enviado al correo. Verifica tu correo para continuar.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error en el envío del código.");
    }
};

exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const { error } = validateEmail(email);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const isValid = await VerificationCode.verifyCode(email, code);
        if (!isValid) {
            return responseHandler(res, 400, "INVALID_CODE", "Código de verificación incorrecto o ha expirado.");
        }

        return responseHandler(res, 200, "CODE_VALIDATED", "Código de verificación aceptado.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error validando el código.");
    }
};

exports.registerStudent = async (req, res) => {
    const { email, password, code } = req.body;

    try {
        const { error } = validateUser({ email, password });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }


        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return responseHandler(res, 409, "EMAIL_ALREADY_REGISTERED", "El correo electrónico ya está registrado, intente con otro.");
        }

        const isValid = await VerificationCode.verifyCode(email, code);
        if (!isValid) {
            return responseHandler(res, 401, "INVALID_CODE", "Código de verificación incorrecto o ha expirado.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userDTO = new UserDTO(email, passwordHash);
        await User.createStudent(userDTO);
        await VerificationCode.deleteCodes(email);

        const user = await User.findByEmail(email);
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000*10, // 10 horas
            domain: '.railway.app',
            path: '/'  
        });

        return responseHandler(res, 201, "USER_REGISTERED", "Usuario registrado con éxito!", {email: user.email, rol: user.role});
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error registrando el usuario.");
    }
};

exports.resetPassword = async (req, res) => {
    const { email, password, code } = req.body;

    try {
        const { error } = validateUser({ email, password });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        const isValid = await VerificationCode.verifyCode(email, code);
        if (!isValid) {
            return responseHandler(res, 401, "INVALID_CODE", "Código de verificación incorrecto o ha expirado.");
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return responseHandler(res, 404, "USER_NOT_FOUND", "El correo del usuario no existe en la base de datos.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await User.updateUser(user.id, { password: passwordHash });
        await VerificationCode.deleteCodes(email);

        return responseHandler(res, 200, "PASSWORD_UPDATED", "Contraseña actualizada correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando la contraseña.");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = validateEmail(email);
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        const user = await User.findByEmail(email);
        if (!user) {
            return responseHandler(res, 404, "USER_NOT_FOUND", "El correo del usuario no existe en la base de datos.");
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return responseHandler(res, 401, "INVALID_CREDENTIALS", "Contraseña incorrecta.", "Debe ingresar una contraseña valida");
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000*10, // 10 horas
            domain: '.railway.app',
            path: '/'  
        });

        return responseHandler(res, 200, "LOGIN_SUCCESS", "Sesión iniciada con éxito. ¡Bienvenido!", {email: user.email, rol: user.role});
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error del servidor.");
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    return responseHandler(res, 200, "LOGOUT_SUCCESS", "Sesión cerrada con éxito.");
};

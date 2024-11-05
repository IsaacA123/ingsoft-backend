const User = require('../models/User');
const { validatePassword, validateEmail } = require("../utils/validator");
const { verifyCode } = require('../services/email');
const bcrypt = require('bcryptjs');
const responseHandler = require('../utils/responseHandler');

exports.getUser = async (req, res) => {
    const { id, email, role } = req.user;
    try {
        return responseHandler(res, 200, "USER_FETCHED", "Datos del usuario obtenidos correctamente.", { id, email, role });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los datos del usuario.");
    }
};

exports.changePass = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
    
    try {
        const { error } = validatePassword({ password });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await User.updateUser(userId, { password: passwordHash });
        return responseHandler(res, 200, "PASSWORD_UPDATED", "Contraseña actualizada correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando la contraseña.");
    }
};

exports.changeEmail = async (req, res) => {
    const { email, code } = req.body;
    const userId = req.user.id;
    
    try {
        const { error } = validateEmail({ email });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const isValid = await verifyCode(email, code);
        if (!isValid) {
            return responseHandler(res, 400, "INVALID_CODE", "Código de verificación incorrecto o ha expirado.");
        }

        await User.updateUser(userId, { email });
        return responseHandler(res, 200, "EMAIL_UPDATED", "Correo actualizado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando el correo.");
    }
};

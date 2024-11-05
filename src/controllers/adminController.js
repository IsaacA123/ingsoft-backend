const User = require("../models/User");
const { validateUser } = require("../utils/validator");
const responseHandler = require("../utils/responseHandler");
const UserDTO = require('../dtos/UserDto');
const bcrypt = require("bcryptjs");

exports.getAllAdmins = async (req, res) => {
    try {
        const result = await User.findByRole("ADMIN");
        return responseHandler(res, 200, "USERS_FETCHED", "Usuarios obtenidos correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los usuarios.");
    }
};

exports.createAdminUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { error } = validateUser({ email, password });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return responseHandler(res, 409, "EMAIL_ALREADY_REGISTERED", "Error en el Registro.", "El correo electrónico ya está registrado.");
        } 
        
        const passwordHash = await bcrypt.hash(password, 10);
        const userDTO = new UserDTO(email,  passwordHash);
        const result = await User.createAdmin(userDTO);
        return responseHandler(res, 201, "USER_CREATE", "Usuario creado correctamente.", { userId: result.insertId });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error al procesar la solicitud", "Error creando el usuario");
    }
};

exports.deleteAdminUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return responseHandler(res, 404, "USER_NOT_FOUND", "Error en la eliminación.", "No hay un usuario con ese identificador.");
        }
        if (existingUser.role !== "ADMIN") {
            return responseHandler(res, 403, "FORBIDEN", "Error en la eliminación.", "No puedes eliminar este usuario.");
        }

        await User.deleteAdmin(userId);
        return responseHandler(res, 200, "USER_DELETE", "Usuario eliminado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error al procesar la solicitud", "Error eliminando al usuario");
    }
};

const User = require('../models/User');
const responseHandler = require('../utils/responseHandler');

exports.getAll = async (req, res) => {
    try {
        const result = await User.findByRole('STUDENT');
        return responseHandler(res, 200, "STUDENTS_FETCHED", "Usuarios obtenidos correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los usuarios.");
    }
};

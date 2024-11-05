const Fine = require('../models/Fine');
const { validateFine } = require("../utils/validator");
const { authorizeRole } = require('../middlewares/authMiddleware');
const responseHandler = require('../utils/responseHandler');
const FineDTO = require('../dtos/FineDTO');


exports.createFine = async (req, res) => {
    const { name, description, end_date, user_id } = req.body;

    try {
        const { error } = validateFine({ name, description, end_date, user_id } );
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        const fineDTO = new FineDTO(name, description, end_date, user_id);
        const result = await Fine.create(fineDTO);

        return responseHandler(res, 201, "FINE_CREATED", "Multa hecha correctamente.", { fineDTO });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error creando la multa.");
    }
};

exports.getAllFines = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    try {
        const result = (role === 'STUDENT') 
            ? await Fine.findByUser(userId) 
            : await Fine.findAll();
        return responseHandler(res, 200, "FINES_FETCHED", "Multas obtenidas correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo las multas.");
    }
};

exports.getFineById = async (req, res) => {
    const { fineId } = req.params;
    const userId = req.user.id;

    try {
        const result = await Fine.findById(fineId);
        if (result.user_id !== userId) {
            authorizeRole(['ADMIN'])(req, res, () => {
                return responseHandler(res, 200, "FINE_FETCHED", "Multa obtenida correctamente.", result);
            });
        } else {
            return responseHandler(res, 200, "FINE_FETCHED", "Multa obtenida correctamente.", result);
        }
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo la multa.");
    }
};

exports.deleteFine = async (req, res) => {
    const { fineId } = req.params;

    try {
        await Fine.delete(fineId);       
        return responseHandler(res, 200, "FINE_DELETED", "Multa eliminada correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error eliminando la multa.");
    }
};

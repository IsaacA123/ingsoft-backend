const LaptopState = require('../models/LaptopState');
const { validateState } = require("../utils/validator");
const responseHandler = require('../utils/responseHandler');


exports.createLaptopState = async (req, res) => {
    const { name, description } = req.body;

    try {
        const { error } = validateState({ name, description });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const result = await LaptopState.create({ name, description });
        return responseHandler(res, 201, "RESOURCE_CREATED", "Estado de las laptops creado correctamente.", { stateId: result.insertId });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error creando el estado de las laptops.");
    }
};

exports.getAllLaptopStates = async (req, res) => {
    try {
        const result = await LaptopState.findAll();
        return responseHandler(res, 200, "RESOURCE_FETCHED", "Estados de las laptops obtenidos correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los estados de las laptops.");
    }
};

exports.getLaptopStateById = async (req, res) => {
    const { stateId } = req.params;

    try {
        const result = await LaptopState.findById(stateId);
        if (!result) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de las laptops no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_FETCHED", "Estado de las laptops obtenido correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo el estado de las laptops.");
    }
};

exports.updateLaptopState = async (req, res) => {
    const { stateId } = req.params;
    const { name, description } = req.body;

    try {
        const { error } = validateState({ name, description });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        
        const result = await LaptopState.update(stateId, { name, description });
        if (result.affectedRows === 0) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de las laptops no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_UPDATED", "Estado de las laptops actualizado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando el estado de las laptops.");
    }
};

exports.deleteLaptopState = async (req, res) => {
    const { stateId } = req.params;

    if (stateId === '1') {
        return responseHandler(res, 403, "FORBIDDEN", "No se puede eliminar el estado de las laptops por defecto.");
    }

    try {
        const result = await LaptopState.delete(stateId);
        if (result.affectedRows === 0) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de las laptops no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_DELETED", "Estado de las laptops eliminado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error eliminando el estado de las laptops.");
    }
};

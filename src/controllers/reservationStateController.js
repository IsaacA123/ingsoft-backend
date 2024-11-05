const ReservationState = require('../models/ReservationState');
const { validateState } = require("../utils/validator");
const responseHandler = require('../utils/responseHandler');


exports.createReservationState = async (req, res) => {
    const { name, description } = req.body;

    try {
        const { error } = validateState({ name, description });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const result = await ReservationState.create({ name, description });
        return responseHandler(res, 201, "RESOURCE_CREATED", "Estado de reserva creado correctamente.", { stateId: result.insertId });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error creando el estado de reserva.");
    }
};

exports.getAllReservationStates = async (req, res) => {
    try {
        const result = await ReservationState.findAll();
        return responseHandler(res, 200, "RESOURCE_FETCHED", "Estados de reserva obtenidos correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los estados de reserva.");
    }
};

exports.getReservationStateById = async (req, res) => {
    const { stateId } = req.params;

    try {
        const result = await ReservationState.findById(stateId);
        if (!result) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de reserva no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_FETCHED", "Estado de reserva obtenido correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo el estado de reserva.");
    }
};

exports.updateReservationState = async (req, res) => {
    const { stateId } = req.params;
    const { name, description } = req.body;

    try {
        const { error } = validateState({ name, description });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }

        const result = await ReservationState.update(stateId, { name, description });
        if (result.affectedRows === 0) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de reserva no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_UPDATED", "Estado de reserva actualizado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando el estado de reserva.");
    }
};

exports.deleteReservationState = async (req, res) => {
    const { stateId } = req.params;

    if (stateId === '1') {
        return responseHandler(res, 403, "FORBIDDEN", "No se puede eliminar el estado de reserva por defecto.");
    }

    try {
        const result = await ReservationState.delete(stateId);
        if (result.affectedRows === 0) {
            return responseHandler(res, 404, "RESOURCE_NOT_FOUND", "Estado de reserva no encontrado.");
        }
        return responseHandler(res, 200, "RESOURCE_DELETED", "Estado de reserva eliminado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error eliminando el estado de reserva.");
    }
};

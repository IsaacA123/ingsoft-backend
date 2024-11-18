const Laptop = require('../models/Laptop');
const { validateLaptop } = require('../utils/validator');
const responseHandler = require('../utils/responseHandler');
const LaptopDTO = require('../dtos/LaptopDto');


exports.getAll = async (req, res) => {
    try {
        const { stateId, reservationStateId } = req.query;  

        let filters = {};

        // Si se pasa un stateId, lo agregamos a los filtros
        if (stateId) {
            filters.stateId = stateId;
        }
        if (reservationStateId) {
            filters.reservationStateId = reservationStateId;
        }

        // Obtenemos los portátiles filtrados
        const result = await Laptop.findAll(filters);

        return responseHandler(res, 200, "LAPTOPS_FETCHED", "Portátiles obtenidos correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los portátiles.");
    }
};


exports.createLaptop = async (req, res) => {
    const { description, state_id, serial } = req.body;

    try {
        const { error } = validateLaptop({ description, state_id, serial } );
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        const laptopDTO = new LaptopDTO(description, state_id, serial);
        console.log("a",laptopDTO);
        const result = await Laptop.create(laptopDTO);
        return responseHandler(res, 201, "LAPTOP_CREATED", "Laptop creada correctamente.", { laptopId: result.insertId });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error creando la Laptop.");
    }
};

exports.updateLaptop = async (req, res) => {
    const { laptopId } = req.params; 
    const { description, state_id, serial } = req.body; 

    try {
        const { error } = validateLaptop({ description, state_id, serial } );
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        await Laptop.update(laptopId, { description, state });
        return responseHandler(res, 200, "LAPTOP_UPDATED", "Laptop actualizada correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando la Laptop.");
    }
};

exports.deleteLaptop = async (req, res) => {
    const { laptopId } = req.params; 

    try {
        await Laptop.delete(laptopId);
        return responseHandler(res, 200, "LAPTOP_DELETED", "Laptop eliminada correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error eliminando la Laptop.");
    }
};

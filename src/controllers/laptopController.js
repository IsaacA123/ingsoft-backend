const Laptop = require('../models/Laptop');
const Reservation = require('../models/Reservation');
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

exports.getDetails = async (req, res) => {
    const { laptopId } = req.params;  // Suponiendo que el laptopId se pasa como parámetro en la URL
    
    try {
        // Obtener los detalles del portátil
        const laptop = await Laptop.findOne(laptopId);

        if (!laptop) {
            return responseHandler(res, 404, "LAPTOP_NOT_FOUND", "Portátil no encontrado.");
        }


        // Obtener las reservas asociadas al portátil, suponiendo que una Laptop tiene varias reservas
        const reservations = await Reservation.getByLaptopId(laptopId);
        
        // Mapear las reservas para solo incluir las fechas (puedes agregar más campos según lo que necesites)
        const reservationDetails = reservations.map(reservation => ({
            Date: reservation.reservation_date,
            startTime: reservation.start_time,
            endTime: reservation.end_time,
            state_id: reservation.state_id,// Puedes agregar más información relevante de la reserva
            state: reservation.state_name // Puedes agregar más información relevante de la reserva
        }));

        // Combinar los datos del portátil con las reservas
        const laptopDetails = {
            id: laptop.id,
            description: laptop.description,
            stateId: laptop.stateId,
            serial: laptop.serial,
            reservations: reservationDetails  // Incluir las reservas
        };

        return responseHandler(res, 200, "LAPTOP_DETAILS_FETCHED", "Detalles del portátil obtenidos correctamente.", laptopDetails);

    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo los detalles del portátil.");
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

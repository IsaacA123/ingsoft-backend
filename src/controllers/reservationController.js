const Reservation = require('../models/Reservation');
const ReservationState = require('../models/ReservationState');
const { validateReservation } = require("../utils/validator");

const { authorizeRole } = require('../middlewares/authMiddleware');
const responseHandler = require('../utils/responseHandler');
const ReservationDTO = require('../dtos/ReservationDto');

exports.createReservation = async (req, res) => {
    const { reservation_date, start_time, end_time, laptop_id } = req.body;
    const reserved_by_user_id = req.user.id;

    try {
        const { error } = validateReservation({ reservation_date, start_time, end_time, laptop_id } );
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return responseHandler(res, 400, "INVALID_INPUT", "Error de validación.", messages);
        }
        const reservationDTO = new ReservationDTO(reservation_date, start_time, end_time, reserved_by_user_id, laptop_id);
        const result = await Reservation.create(reservationDTO);
        return responseHandler(res, 201, "RESERVATION_CREATED", "Reserva creada correctamente.", { reservationId: result.insertId });
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error creando la reserva.");
    }
};

exports.getAllReservations = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    try {
        const result = (role === 'STUDENT') 
            ? await Reservation.findByUser(userId) 
            : await Reservation.findAll();
        return responseHandler(res, 200, "RESERVATIONS_FETCHED", "Reservas obtenidas correctamente.", result);
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo las reservas.");
    }
};

exports.getReservationById = async (req, res) => {
    const { reservationId } = req.params;
    const userId = req.user.id;

    try {
        const result = await Reservation.findById(reservationId);
        if (result.reserved_by_user_id !== userId) {
            authorizeRole(['ADMIN'])(req, res, () => {
                return responseHandler(res, 200, "RESERVATION_FETCHED", "Reserva obtenida correctamente.", result);
            });
        } else {
            return responseHandler(res, 200, "RESERVATION_FETCHED", "Reserva obtenida correctamente.", result);
        }
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error obteniendo la reserva.");
    }
};

exports.updateStateReservation = async (req, res) => {
    const { reservationId } = req.params;
    const { state_id } = req.body;

    try {
        const existingUser = await ReservationState.findById(state_id);
        if (existingUser) {
            return responseHandler(res, 409, "EMAIL_ALREADY_REGISTERED", "Error en el Registro.", "El correo electrónico ya está registrado.");
        }

        await Reservation.updateReservationState(reservationId, { state_id });
        return responseHandler(res, 200, "RESERVATION_STATE_UPDATED", "Estado de la reserva actualizado correctamente.");
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error actualizando la reserva.");
    }
};

exports.deleteReservation = async (req, res) => {
    const { reservationId } = req.params;
    const userId = req.user.id;

    try {
        const result = await Reservation.findById(reservationId);
        if (result.reserved_by_user_id !== userId) {
            await authorizeRole(['ADMIN'])(req, res, async () => {
                await Reservation.delete(reservationId);
                return responseHandler(res, 200, "RESERVATION_DELETED", "Reserva eliminada correctamente usando privilegios de administrador.");
            });
        } else {
            await Reservation.delete(reservationId);
            return responseHandler(res, 200, "RESERVATION_DELETED", "Reserva eliminada correctamente.");
        }
    } catch (error) {
        console.error(error);
        return responseHandler(res, 500, "INTERNAL_SERVER_ERROR", "Error eliminando la reserva.");
    }
};

const Reservation = require('../models/Reservation');

exports.create = async (req, res) => {
    const { state, reservation_date, start_time, end_time, user_id, reserved_by_user_id, laptop_id } = req.body;
    try {
        const result = await Reservation.create({ state, reservation_date, start_time, end_time, user_id, reserved_by_user_id, laptop_id });
        res.status(201).json({ message: "Reserva creada correctamente", reservationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando la reserva', error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const result = await Reservation.findAll();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las reservas', error: error.message });
    }
};

exports.getById = async (req, res) => {
    const {reservationId} = req.params;
    try {
        const result = await Reservation.findById(reservationId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las reservas', error: error.message });
    }
};

exports.getSelfAll = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await Reservation.findByUser(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las reservas', error: error.message });
    }
};

exports.updateReservationState = async (req, res) => {
    const { reservationId } = req.params;
    const { state } = req.body;

    try {
        await Reservation.updateState(reservationId, { state });
        res.status(200).json({ message: 'Estado de la reserva actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando la reserva', error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        await Reservation.delete(reservationId);
        res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando la reserva', error: error.message });
    }
};

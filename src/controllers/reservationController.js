const Reservation = require('../models/Reservation');
const { authorizeRole } = require('../middlewares/authMiddleware');


exports.create = async (req, res) => {
    const { state, reservation_date, start_time, end_time, laptop_id } = req.body;
    const reserved_by_user_id = req.user.id;

    try {
        const result = await Reservation.create({ state, reservation_date, start_time, end_time, reserved_by_user_id, laptop_id });
        res.status(201).json({ message: "Reserva creada correctamente", reservationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando la reserva', error: error.message });
    }
};

exports.getAll = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;
    try {
        const result = (role === 'STUDENT') 
            ? await Reservation.findByUser(userId) 
            : await Reservation.findAll();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las reservas', error: error.message });
    }
};

exports.getById = async (req, res) => {
    const {reservationId} = req.params;
    const userId = req.user.id;
    
    try {
        const result = await Reservation.findById(reservationId);
        if(result.reserved_by_user_id != userId){
            authorizeRole(['ADMIN'])(req, res, () => {
                res.status(200).json(result);
            });
        } else {
            res.status(200).json(result);
        }
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
    const userId = req.user.id;

    try {
        const result = await Reservation.findById(reservationId);
        if(result.reserved_by_user_id != userId){
            await authorizeRole(['ADMIN'])(req, res, async () => {
                await Reservation.delete(reservationId);
                res.status(200).json({ message: 'Reserva eliminada correctamente usando privilegios de administrador' });
            });
        } else {
            await Reservation.delete(reservationId);
            res.status(200).json({ message: 'Reserva eliminada correctamente' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando la reserva', error: error.message });
    }
};

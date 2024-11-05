const express = require('express');
const reservationRoutes = express.Router();
const { createReservation, getAllReservations, getReservationById, updateStateReservation, deleteReservation } = require('../controllers/reservationController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');

//Reservas
reservationRoutes.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAllReservations);
reservationRoutes.get('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getReservationById);
reservationRoutes.delete('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), deleteReservation);
reservationRoutes.patch('/:reservationId', authMiddleware, authorizeRole(['ADMIN']), updateStateReservation);
reservationRoutes.post('/', authMiddleware, authorizeRole(['STUDENT']), createReservation);


module.exports = reservationRoutes;
 
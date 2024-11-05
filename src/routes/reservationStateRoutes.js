const express = require('express');
const reservationStateRoutes = express.Router();
const { createReservationState, getAllReservationStates, getReservationStateById, updateReservationState, deleteReservationState } = require('../controllers/reservationStateController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// Estados de las reservas
reservationStateRoutes.get('/', authMiddleware, authorizeRole(['SUPERADMIN', 'ADMIN']), getAllReservationStates);
reservationStateRoutes.get('/:stateId', authMiddleware, authorizeRole(['SUPERADMIN', 'ADMIN']), getReservationStateById);
reservationStateRoutes.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createReservationState);
reservationStateRoutes.put('/:stateId', authMiddleware, authorizeRole(['SUPERADMIN']), updateReservationState);
reservationStateRoutes.delete('/:stateId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteReservationState);

module.exports = reservationStateRoutes;

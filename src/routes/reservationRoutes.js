const express = require('express');
const reservationRoutes = express.Router();
const { create, getAll, getById, updateReservationState, deleteReservation } = require('../controllers/reservationController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// estudiante o administrador
reservationRoutes.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAll);
reservationRoutes.get('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getById);
reservationRoutes.delete('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), deleteReservation);

// para el administrador
reservationRoutes.put('/state/:reservationId', authMiddleware, authorizeRole(['ADMIN']), updateReservationState);

// para el estudiante
reservationRoutes.post('/', authMiddleware, authorizeRole(['STUDENT']), create);


module.exports = reservationRoutes;
 
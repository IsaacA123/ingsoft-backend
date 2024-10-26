const express = require('express');
const router = express.Router();
const { create, getAll, getById, updateReservationState, deleteReservation } = require('../controllers/reservationController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


//estudiante o administrador
router.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAll);
router.get('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getById);
router.delete('/:reservationId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), deleteReservation);

//para el administrador
router.put('/state/:reservationId', authMiddleware, authorizeRole(['ADMIN']), updateReservationState);

//para el estudiante
router.post('/', authMiddleware, authorizeRole(['STUDENT']), create);


module.exports = router;
 
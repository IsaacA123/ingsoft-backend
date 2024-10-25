const express = require('express');
const router = express.Router();
const { create, getAll, getById, getSelfAll, updateReservationState, deleteReservation, getSelfById, deleteSelf} = require('../controllers/reservationController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');

//para el administrador
router.get('/admin', authMiddleware, authorizeRole(['ADMIN']), getAll);
router.get('/admin/:reservationId', authMiddleware, authorizeRole(['ADMIN']), getById);
router.put('/admin/:reservationId', authMiddleware, authorizeRole(['ADMIN']), updateReservationState);
router.delete('/admin/:reservationId', authMiddleware, authorizeRole(['ADMIN']), deleteReservation);

//para el estudiante
router.get('/student', authMiddleware, authorizeRole(['STUDENT']), getSelfAll);
router.post('/student', authMiddleware, authorizeRole(['STUDENT']), create);
//router.get('/student/:reservationId', authMiddleware, authorizeRole(['STUDENT']), getSelfById);
//router.get('/student/:reservationId', authMiddleware, authorizeRole(['STUDENT']), deleteSelf);




//router.get('/admin/:id', getById);


module.exports = router;

const express = require('express');
const finesRoutes = express.Router();
const { getAllFines, getFineById, createFine, deleteFine } = require('../controllers/fineController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// para el administrador o estudiante
finesRoutes.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAllFines);
finesRoutes.get('/:fineId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getFineById);

// para el administrador
finesRoutes.post('/', authMiddleware, authorizeRole(['ADMIN']), createFine);
finesRoutes.delete('/:fineId', authMiddleware, authorizeRole(['ADMIN']), deleteFine);


module.exports = finesRoutes;

const express = require('express');
const finesRoutes = express.Router();
const { getAll, getById, create, deleteFine } = require('../controllers/fineController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// para el administrador o estudiante
finesRoutes.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAll);
finesRoutes.get('/:fineId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getById);

// para el administrador
finesRoutes.post('/', authMiddleware, authorizeRole(['ADMIN']), create);
finesRoutes.delete('/:fineId', authMiddleware, authorizeRole(['ADMIN']), deleteFine);


module.exports = finesRoutes;

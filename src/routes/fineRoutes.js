const express = require('express');
const router = express.Router();
const { getAll, getById, create, deleteFine } = require('../controllers/fineController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// para el administrador o estudiante
router.get('/', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getAll);
router.get('/:fineId', authMiddleware, authorizeRole(['ADMIN', 'STUDENT']), getById);

// para el administrador
router.post('/', authMiddleware, authorizeRole(['ADMIN']), create);
router.delete('/:fineId', authMiddleware, authorizeRole(['ADMIN']), deleteFine);


module.exports = router;

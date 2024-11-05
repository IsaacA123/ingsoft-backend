const express = require('express');
const laptopStateRoutes = express.Router();
const { createLaptopState, getAllLaptopStates, getLaptopStateById, updateLaptopState, deleteLaptopState } = require('../controllers/laptopStateController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


// Estados de los portatiles
laptopStateRoutes.get('/', authMiddleware, authorizeRole(['SUPERADMIN', 'ADMIN']), getAllLaptopStates);
laptopStateRoutes.get('/:laptopId', authMiddleware, authorizeRole(['SUPERADMIN', 'ADMIN']), getLaptopStateById);
laptopStateRoutes.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createLaptopState);
laptopStateRoutes.put('/:laptopId', authMiddleware, authorizeRole(['SUPERADMIN']), updateLaptopState);
laptopStateRoutes.delete('/:laptopId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteLaptopState);

module.exports = laptopStateRoutes;

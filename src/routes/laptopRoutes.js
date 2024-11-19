const express = require('express');
const laptopRoutes = express.Router();
const { getAll, getDetails, createLaptop, updateLaptop, deleteLaptop } = require('../controllers/laptopController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


laptopRoutes.get('/', authMiddleware, authorizeRole(['ADMIN', "STUDENT"]), getAll);
laptopRoutes.get('/:laptopId', authMiddleware, authorizeRole(['ADMIN', "STUDENT"]), getDetails);
laptopRoutes.post('/', authMiddleware, authorizeRole(['ADMIN']), createLaptop);
laptopRoutes.put('/:laptopId', authMiddleware, authorizeRole(['ADMIN']), updateLaptop);
laptopRoutes.delete('/:laptopId', authMiddleware, authorizeRole(['ADMIN']), deleteLaptop);


module.exports = laptopRoutes;

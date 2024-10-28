const express = require('express');
const { getAll, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const adminRoutes = express.Router();


adminRoutes.get('/', authMiddleware, authorizeRole(['SUPERADMIN']), getAll);
adminRoutes.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createAdmin);
adminRoutes.delete('/:userId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteAdmin);


module.exports = adminRoutes;

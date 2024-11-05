const express = require('express');
const { getAllAdmins, createAdminUser, deleteAdminUser } = require('../controllers/adminController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const adminRoutes = express.Router();


adminRoutes.get('/', authMiddleware, authorizeRole(['SUPERADMIN']), getAllAdmins);
adminRoutes.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createAdminUser);
adminRoutes.delete('/:userId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteAdminUser);


module.exports = adminRoutes;

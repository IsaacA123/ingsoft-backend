const express = require('express');
const studentRoutes = express.Router();
const { getAll } = require('../controllers/studentController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


studentRoutes.get('/', authMiddleware, authorizeRole(['ADMIN']), getAll);


module.exports = studentRoutes;

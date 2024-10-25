const express = require('express');
const router = express.Router();
const { getById, getAll, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, authorizeRole(['SUPERADMIN']), getAll);
router.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createAdmin);
router.delete('/:userId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteAdmin);

//router.get('/admin/:id', getById);


module.exports = router;

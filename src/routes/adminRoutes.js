const express = require('express');
const router = express.Router();
const { getAll, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, authorizeRole(['SUPERADMIN']), getAll);
router.post('/', authMiddleware, authorizeRole(['SUPERADMIN']), createAdmin);
router.delete('/:userId', authMiddleware, authorizeRole(['SUPERADMIN']), deleteAdmin);


module.exports = router;

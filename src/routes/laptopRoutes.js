const express = require('express');
const router = express.Router();
const { getAll, createLaptop, updateLaptop, deleteLaptop } = require('../controllers/laptopController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, authorizeRole(['ADMIN', "STUDENT"]), getAll);
router.post('/', authMiddleware, authorizeRole(['ADMIN']), createLaptop);
router.put('/:laptopId', authMiddleware, authorizeRole(['ADMIN']), updateLaptop);
router.delete('/:laptopId', authMiddleware, authorizeRole(['ADMIN']), deleteLaptop);

//router.get('/admin/:id', getById);


module.exports = router;

const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/studentController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, authorizeRole(['ADMIN']), getAll);

//router.get('/:userId', authMiddleware, authorizeRole(['ADMIN']), getAll);



module.exports = router;

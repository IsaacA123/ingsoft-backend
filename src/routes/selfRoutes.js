const express = require('express');
const router = express.Router();
const { getSelf, changeEmail, changePass } = require('../controllers/selfController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, getSelf);
router.put('/change_pass', authMiddleware, changePass);
router.put('/change_email', authMiddleware, changeEmail);


module.exports = router;

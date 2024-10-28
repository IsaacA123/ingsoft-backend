const express = require('express');
const selfRoutes = express.Router();
const { getSelf, changeEmail, changePass } = require('../controllers/selfController');
const { authMiddleware } = require('../middlewares/authMiddleware');


selfRoutes.get('/', authMiddleware, getSelf);
selfRoutes.put('/change_pass', authMiddleware, changePass);
selfRoutes.put('/change_email', authMiddleware, changeEmail);


module.exports = selfRoutes;

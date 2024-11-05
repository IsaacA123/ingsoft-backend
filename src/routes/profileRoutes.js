const express = require('express');
const selfRoutes = express.Router();
const { getUser, changeEmail, changePass } = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');


selfRoutes.get('/', authMiddleware, getUser);
selfRoutes.put('/change_pass', authMiddleware, changePass);
selfRoutes.put('/change_email', authMiddleware, changeEmail);


module.exports = selfRoutes;

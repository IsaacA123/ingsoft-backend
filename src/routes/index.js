const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');
const selfRoutes = require('./selfRoutes');
const laptopRoutes = require('./laptopRoutes');
const reservationRoutes = require('./reservationRoutes');
const finesRoutes = require('./fineRoutes');


// rutas
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/students', studentRoutes);
router.use('/self', selfRoutes);
router.use('/laptops', laptopRoutes);
router.use('/reservations', reservationRoutes);
router.use('/fines', finesRoutes);

module.exports = router;

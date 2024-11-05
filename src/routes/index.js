const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');
const profileRoutes = require('./profileRoutes');
const laptopRoutes = require('./laptopRoutes');
const reservationRoutes = require('./reservationRoutes');
const reservationStateRoutes = require('./reservationStateRoutes');
const laptopStateRoutes = require('./laptopStateRoutes');
const finesRoutes = require('./fineRoutes');


// rutas
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/students', studentRoutes);
router.use('/profile', profileRoutes);
router.use('/laptops', laptopRoutes);
router.use('/reservations', reservationRoutes);
router.use('/reservation-states', reservationStateRoutes);
router.use('/laptop-states', laptopStateRoutes);
router.use('/fines', finesRoutes);

module.exports = router;

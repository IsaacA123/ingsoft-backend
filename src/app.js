const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const selfRoutes = require('./routes/selfRoutes');
const laptopsRoutes = require('./routes/laptopRoutes');
const reservationsRoutes = require('./routes/reservationRoutes');
const createTables = require('./config/createTables');

const app = express();

// Cors
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users/admins', adminRoutes);
app.use('/api/users/students', studentRoutes);
app.use('/api/users/self', selfRoutes);

app.use('/api/laptops', laptopsRoutes);
app.use('/api/reservations', reservationsRoutes);





// Crear las tablas si no existen
createTables();

// Iniciar el servidor
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

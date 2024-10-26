const express = require('express');
const cors = require('cors');
const { swaggerUi, specs  } = require('./swagger/swagger'); 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const selfRoutes = require('./routes/selfRoutes');
const laptopsRoutes = require('./routes/laptopRoutes');
const reservationsRoutes = require('./routes/reservationRoutes');
require('dotenv').config();
const createTables = require('./config/createTables');

const app = express();

// Cors
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/self', selfRoutes);
app.use('/api/laptops', laptopsRoutes);
app.use('/api/reservations', reservationsRoutes);

//Swagger documentación
app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

// Crear las tablas si no existen
createTables();

// Iniciar el servidor
const PORT = process.env.PORT ?? 3001;
const BASE_URL = process.env.BASE_URL ?? 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${BASE_URL}`);
});



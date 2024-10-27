const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const createTables = require('./config/createTables');
const { swaggerUi, specs  } = require('./swagger/swagger'); 
require('dotenv').config();

// Importando las rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const selfRoutes = require('./routes/selfRoutes');
const laptopsRoutes = require('./routes/laptopRoutes');
const reservationsRoutes = require('./routes/reservationRoutes');
const finesRoutes = require('./routes/fineRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/self', selfRoutes);
app.use('/api/laptops', laptopsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/fines', finesRoutes);

//Swagger documentación
app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

// Crear las tablas si no existen
createTables();

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${BASE_URL}. Visitalo para leer la documentación.`);
});



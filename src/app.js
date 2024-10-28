const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const createTables = require('./config/createTables');
const router = require('./routes/index');
const { swaggerUi, specs  } = require('./swagger/swagger'); 
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Rutas
app.use('/api', router)

// Swagger documentación
app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

// Crear las tablas si no existen
createTables();

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${BASE_URL}. Visitalo para leer la documentación.`);
});



const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de prestamos de Portatiles.',
      version: '1.0.0',
      description: `
  Esta API permite gestionar usuarios, portátiles, préstamos y multas. El acceso a las diferentes funcionalidades está determinado por el rol del usuario.
  ### Roles de Usuario
  - **Superadmin**: 
    - Es un usuario único que se crea al desplegar la aplicación, siempre que no exista previamente.
  - **Admin**: 
    - Este tipo de usuario solo puede ser creado por el superadmin.
  - **Student**: 
    - Cualquier persona que se registre a través de los enlaces de autenticación .
      `,
    },
    servers: [
      {
        url: `${process.env.BASE_URL}/api`,
        description: 'Servidor de pruebas',
      },
    ],
  },
  apis: ['./src/swagger/*.yml'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};

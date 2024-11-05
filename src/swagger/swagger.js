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
  ### Respuestas de Error
  Cuando ocurre un error en la API, se devuelve una respuesta en el siguiente formato:
  \`\`\`json
  {
    "status": 400,
    "code": "INVALID_INPUT",
    "message": "Errores de validación.",
    "details": [
        "El campo 'email' no puede estar vacío.",
        "La contraseña debe tener al menos 6 caracteres."
    ]
  }
  \`\`\`
  ### Respuestas exitosas
  Cuando se obtiene una respuesta exitosa en la API, se devuelve una respuesta en el siguiente formato:
  \`\`\`
  {
    "status": "success",
    "code": "USER_CREATED",
    "message": "Solicitud procesada exitosamente."
    "data": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
      },
  }
  \`\`\`
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

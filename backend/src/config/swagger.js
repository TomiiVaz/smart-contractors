const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkEscrow Backend API',
      version: '1.0.0',
      description: 'API del backend WorkEscrow que se comunica con la API raíz de blockchain',
      contact: {
        name: 'WorkEscrow Team',
        email: 'team@workescrow.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint /users/login'
        }
      },
      schemas: {}
    }
  },
  apis: ['./src/controllers/*.js'] // Ruta a los archivos con anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = specs;

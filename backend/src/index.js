require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const app = express();

const userController = require('./controllers/userController');
const workController = require('./controllers/workController');

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('❌ No se encontró la variable de entorno JWT_SECRET');
  process.exit(1);
}

// Inicializar base de datos
require('./db');
console.log('✅ Base de datos inicializada correctamente');

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WorkEscrow Backend API'
}));

// Rutas públicas (ejemplo: login y registro)
app.use('/users', userController);

// Rutas de trabajos (incluye todas las funcionalidades del Swagger)
app.use('/works', workController);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});


const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const workService = require('../services/workService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Email del usuario
 *         walletAddress:
 *           type: string
 *           description: Dirección de wallet del usuario
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "alice@mail.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "hashed_pass3"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: Email del usuario autenticado
 *           example: "alice@mail.com"
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuarios
 *     description: Obtiene la lista de todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', (req, res) => { // Propio para pruebas
  userService.listUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar usuario
 *     description: Registra un nuevo usuario en el sistema
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['name', 'email', 'password']
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: 'Alice'
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: 'alice@mail.com'
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 'hashed_pass3'
 *               wallet_address:
 *                 type: string
 *                 description: Dirección de wallet del usuario (opcional)
 *                 example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: 'Alice'
 *                 email:
 *                   type: string
 *                   example: 'alice@mail.com'
 *       400:
 *         description: Error en los datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', (req, res) => {
  const { name, email, password, wallet_address } = req.body;
  userService.addUser(name, email, password, wallet_address, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ name: user.name, email: user.email, wallet_address: user.wallet_address });
  });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticar usuario
 *     description: Autentica un usuario y devuelve un token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  userService.login(email, password, (err, result) => {
    if (err) return res.status(401).json({ error: err.message });
    res.json({ user: result.user.email, token: result.token });
  });
});

/**
 * @swagger
 * /users/wallet:
 *   get:
 *     summary: Obtener wallet address del usuario autenticado
 *     description: Obtiene la dirección de wallet del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet address obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     walletAddress:
 *                       type: string
 *                       description: Dirección de wallet del usuario
 *                       example: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/wallet', authMiddleware, (req, res) => {
  const userId = req.user.id;
  
  // Validar que el userId existe
  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario no encontrado en el token' });
  }

  userService.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      data: {
        walletAddress: user.wallet_address
      }
    });
  });
});

/**
 * @swagger
 * /users/balance:
 *   get:
 *     summary: Obtener balance USDC del usuario autenticado
 *     description: Obtiene el balance de USDC del usuario autenticado desde blockchain
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: string
 *                       description: Balance en USDC
 *                       example: "1000.50"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error de blockchain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Validar que el userId existe
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario no encontrado en el token' });
    }
    
    // Obtener usuario para conseguir su wallet address
    userService.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (!user.wallet_address) {
        return res.status(400).json({ error: 'Usuario no tiene wallet address configurado' });
      }

      // Obtener balance desde blockchain
      workService.getUSDCBalance(user.wallet_address)
        .then(balance => {
          res.json({
            success: true,
            data: {
              balance: balance
            }
          });
        })
        .catch(error => {
          console.error('Error getting balance:', error);
          res.status(500).json({
            success: false,
            error: error.message || 'Error obteniendo balance desde blockchain'
          });
        });
    });

  } catch (error) {
    console.error('Error in balance endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene los detalles de un usuario específico
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  userService.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      data: user
    });
  });
});

module.exports = router;

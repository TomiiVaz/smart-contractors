const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

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
router.get('/', (req, res) => {
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
  const { name, email, password } = req.body;
  userService.addUser(name, email, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ name: user.name, email: user.email });
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
 * /users/{id}/wallet:
 *   put:
 *     summary: Actualizar dirección de wallet
 *     description: Actualiza la dirección de wallet de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['wallet_address']
 *             properties:
 *               wallet_address:
 *                 type: string
 *                 description: Dirección de wallet del usuario
 *                 example: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
 *     responses:
 *       200:
 *         description: Dirección de wallet actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error de validación
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
router.put('/:id/wallet', (req, res) => {
  const userId = parseInt(req.params.id);
  const { wallet_address } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  if (!wallet_address) {
    return res.status(400).json({ error: 'Dirección de wallet es requerida' });
  }

  userService.updateWalletAddress(userId, wallet_address, (err, result) => {
    if (err) {
      if (err.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    res.json({
      success: true,
      message: 'Wallet address actualizada exitosamente',
      data: result
    });
  });
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

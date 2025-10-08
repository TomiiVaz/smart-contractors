const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

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

module.exports = router;

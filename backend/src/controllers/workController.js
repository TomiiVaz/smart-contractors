const express = require('express');
const router = express.Router();
const workService = require('../services/workService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateWorkRequest:
 *       type: object
 *       required:
 *         - worker
 *         - amount
 *         - title
 *         - description
 *         - deadline
 *       properties:
 *         worker:
 *           type: string
 *           description: Dirección de wallet del trabajador
 *           example: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
 *         amount:
 *           type: number
 *           description: Cantidad en USDC
 *           example: 100.50
 *         title:
 *           type: string
 *           description: Título del trabajo
 *           example: "Desarrollar sitio web"
 *         description:
 *           type: string
 *           description: Descripción del trabajo
 *           example: "Sitio web con React y TypeScript"
 *         deadline:
 *           type: integer
 *           description: Timestamp límite
 *           example: 1704067200
 */

/**
 * @swagger
 * /works:
 *   post:
 *     summary: Crear un nuevo trabajo
 *     description: Crea un nuevo trabajo en blockchain y lo persiste en la base de datos local
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkRequest'
 *           example:
 *             worker: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
 *             amount: 150.75
 *             title: "Desarrollar API REST"
 *             description: "API REST con Node.js y Express para e-commerce"
 *             deadline: 1704153600
 *     responses:
 *       201:
 *         description: Trabajo creado exitosamente
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      worker,
      amount,
      title,
      description,
      deadline
    } = req.body;

    // Validaciones básicas
    if (!worker) {
      return res.status(400).json({ error: 'Worker address is required' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!deadline) {
      return res.status(400).json({ error: 'Deadline is required' });
    }

    const work = await workService.createWork({
      worker,
      amount: parseFloat(amount),
      title: title.trim(),
      description: description.trim(),
      deadline: parseInt(deadline)
    }, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Work created successfully',
      data: work
    });

  } catch (error) {
    console.error('Error creating work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /works:
 *   get:
 *     summary: Obtener todos los trabajos
 *     description: Obtiene la lista de todos los trabajos con filtros opcionales
 *     tags: [Trabajos]
 *     parameters:
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Dirección del cliente
 *       - in: query
 *         name: worker
 *         schema:
 *           type: string
 *         description: Dirección del trabajador
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Estado del trabajo
 *     responses:
 *       200:
 *         description: Lista de trabajos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Work'
 */
router.get('/', async (req, res) => {
  try {
    const works = await workService.getAllWorks();
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /works/:id - Obtener trabajo por ID
router.get('/:id', async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    const work = await workService.getWork(workId);
    res.json({
      success: true,
      data: work
    });
  } catch (error) {
    console.error('Error getting work:', error);
    if (error.message === 'Work not found') {
      res.status(404).json({
        success: false,
        error: 'Work not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
});

// GET /works/client/:id - Obtener trabajos por cliente
router.get('/client/:id', async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const works = await workService.getWorksByClient(clientId);
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works by client:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /works/worker/:id - Obtener trabajos por worker
router.get('/worker/:id', async (req, res) => {
  try {
    const workerId = parseInt(req.params.id);
    
    if (isNaN(workerId)) {
      return res.status(400).json({ error: 'Invalid worker ID' });
    }

    const works = await workService.getWorksByWorker(workerId);
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    console.error('Error getting works by worker:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /works/{id}/accept:
 *   post:
 *     summary: Aceptar trabajo
 *     description: Permite a un trabajador aceptar un trabajo
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptWorkRequest'
 *           example:
 *             workerId: 2
 *     responses:
 *       200:
 *         description: Trabajo aceptado exitosamente
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
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { workerId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' });
    }

    const work = await workService.acceptWork(workId, parseInt(workerId));
    res.json({
      success: true,
      message: 'Work accepted successfully',
      data: work
    });

  } catch (error) {
    console.error('Error accepting work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/submit - Entregar trabajo
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { deliveryData, workerId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!deliveryData) {
      return res.status(400).json({ error: 'Delivery data is required' });
    }

    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID is required' });
    }

    const work = await workService.submitWork(workId, deliveryData, parseInt(workerId));
    res.json({
      success: true,
      message: 'Work submitted successfully',
      data: work
    });

  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/approve - Aprobar trabajo
router.post('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const work = await workService.approveWork(workId, parseInt(clientId));
    res.json({
      success: true,
      message: 'Work approved successfully',
      data: work
    });

  } catch (error) {
    console.error('Error approving work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/:id/cancel - Cancelar trabajo
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const workId = parseInt(req.params.id);
    const { clientId } = req.body;

    if (isNaN(workId)) {
      return res.status(400).json({ error: 'Invalid work ID' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const work = await workService.cancelWork(workId, parseInt(clientId));
    res.json({
      success: true,
      message: 'Work cancelled successfully',
      data: work
    });

  } catch (error) {
    console.error('Error cancelling work:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /works/balance/{address}:
 *   get:
 *     summary: Obtener balance USDC
 *     description: Obtiene el balance de USDC de una dirección de wallet
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Dirección de wallet
 *         example: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
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
 *                   $ref: '#/components/schemas/Balance'
 *       400:
 *         description: Dirección inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balance/:address', async (req, res) => {
  try {
    const address = req.params.address;

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Dirección de wallet inválida'
      });
    }

    const balance = await workService.getUSDCBalance(address);

    res.json({
      success: true,
      data: {
        balance: balance
      }
    });

  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /works/approve - Aprobar gasto USDC
router.post('/approve', async (req, res) => {
  try {
    const { spender, amount } = req.body;

    if (!spender || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Spender y amount son requeridos'
      });
    }

    if (!spender.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Dirección de spender inválida'
      });
    }

    const result = await workService.approveUSDC(spender, amount);

    res.json({
      success: true,
      message: 'Aprobación realizada exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error approving USDC:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /works/health:
 *   get:
 *     summary: Health check básico
 *     description: Verifica el estado básico de la API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Estado del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "healthy"
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

/**
 * @swagger
 * /works/health/detailed:
 *   get:
 *     summary: Health check detallado
 *     description: Verifica el estado detallado de todos los servicios conectados
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Estado detallado del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: "connected"
 *                     blockchain:
 *                       type: string
 *                       example: "connected"
 *                     api:
 *                       type: string
 *                       example: "running"
 *                 blockchain:
 *                   type: object
 *                   description: Estado detallado de la conexión blockchain
 *       500:
 *         description: Error en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health/detailed', async (req, res) => {
  try {
    const blockchainStatus = await workService.checkBlockchainConnection();
    
    res.json({
      success: true,
      status: "healthy",
      services: {
        database: "connected",
        blockchain: blockchainStatus.connected ? "connected" : "disconnected",
        api: "running"
      },
      blockchain: blockchainStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "unhealthy",
      services: {
        database: "connected",
        blockchain: "error",
        api: "running"
      },
      error: error.message
    });
  }
});

module.exports = router;

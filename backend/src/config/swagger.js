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
      schemas: {
        Work: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del trabajo'
            },
            clientAddress: {
              type: 'string',
              description: 'Dirección de wallet del cliente'
            },
            workerAddress: {
              type: 'string',
              description: 'Dirección de wallet del trabajador'
            },
            amount: {
              type: 'number',
              description: 'Cantidad en USDC'
            },
            title: {
              type: 'string',
              description: 'Título del trabajo'
            },
            description: {
              type: 'string',
              description: 'Descripción del trabajo'
            },
            status: {
              type: 'integer',
              description: 'Estado del trabajo (0: Created, 1: InProgress, 2: Submitted, 3: Completed, 4: Cancelled)'
            },
            createdAt: {
              type: 'integer',
              description: 'Timestamp de creación'
            },
            deadline: {
              type: 'integer',
              description: 'Timestamp límite'
            },
            deliveryData: {
              type: 'string',
              description: 'Datos de entrega'
            },
            blockchainWorkId: {
              type: 'string',
              description: 'ID del trabajo en blockchain'
            },
            transactionHash: {
              type: 'string',
              description: 'Hash de la transacción'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            email: {
              type: 'string',
              description: 'Email del usuario'
            },
            walletAddress: {
              type: 'string',
              description: 'Dirección de wallet del usuario'
            }
          }
        },
        Balance: {
          type: 'object',
          properties: {
            balance: {
              type: 'string',
              description: 'Balance en USDC'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensaje de éxito'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        },
        CreateWorkRequest: {
          type: 'object',
          required: ['worker', 'amount', 'title', 'description', 'deadline'],
          properties: {
            worker: {
              type: 'string',
              description: 'Dirección de wallet del trabajador',
              example: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'
            },
            amount: {
              type: 'number',
              description: 'Cantidad en USDC',
              example: 150.75
            },
            title: {
              type: 'string',
              description: 'Título del trabajo',
              example: 'Desarrollar API REST'
            },
            description: {
              type: 'string',
              description: 'Descripción del trabajo',
              example: 'API REST con Node.js y Express para e-commerce'
            },
            deadline: {
              type: 'integer',
              description: 'Timestamp límite',
              example: 1704153600
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'alice@mail.com'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
              example: 'hashed_pass3'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'Email del usuario autenticado',
              example: 'alice@mail.com'
            },
            token: {
              type: 'string',
              description: 'Token JWT para autenticación',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        AcceptWorkRequest: {
          type: 'object',
          required: ['workerId'],
          properties: {
            workerId: {
              type: 'integer',
              description: 'ID del trabajador que acepta el trabajo',
              example: 2
            }
          }
        },
        SubmitWorkRequest: {
          type: 'object',
          required: ['deliveryData', 'workerId'],
          properties: {
            deliveryData: {
              type: 'string',
              description: 'Datos de entrega del trabajo',
              example: 'https://github.com/usuario/proyecto-completado'
            },
            workerId: {
              type: 'integer',
              description: 'ID del trabajador que entrega',
              example: 2
            }
          }
        },
        ApproveWorkRequest: {
          type: 'object',
          required: ['clientId'],
          properties: {
            clientId: {
              type: 'integer',
              description: 'ID del cliente que aprueba',
              example: 1
            }
          }
        },
        CancelWorkRequest: {
          type: 'object',
          required: ['clientId'],
          properties: {
            clientId: {
              type: 'integer',
              description: 'ID del cliente que cancela',
              example: 1
            }
          }
        },
        ApproveUSDCRequest: {
          type: 'object',
          required: ['spender', 'amount'],
          properties: {
            spender: {
              type: 'string',
              description: 'Dirección que puede gastar USDC',
              example: '0x1234567890abcdef1234567890abcdef12345678'
            },
            amount: {
              type: 'string',
              description: 'Cantidad a aprobar',
              example: '1000.00'
            }
          }
        }
      }
    }
  },
  apis: ['./src/controllers/*.js'] // Ruta a los archivos con anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = specs;

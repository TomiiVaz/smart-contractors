# 🚀 WorkEscrow Backend - Documentación Completa

## 📑 **Índice**

1. [Descripción General](#-descripción-general)
2. [Arquitectura de Puertos](#-arquitectura-de-puertos)
3. [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
4. [Arquitectura por Capas](#️-arquitectura-por-capas)
5. [Autenticación JWT](#-autenticación-jwt)
6. [Swagger Documentation](#-swagger-documentation)
7. [Integración Blockchain](#-integración-blockchain)
8. [Instalación y Ejecución](#-instalación-y-ejecución)
9. [Configuración de Variables](#️-configuración-de-variables)
10. [Docker Compose](#-docker-compose)
11. [Endpoints de la API](#-endpoints-de-la-api)
12. [Testing y Postman](#-testing-y-postman)
13. [Testing de Arquitectura](#-testing-de-arquitectura)
14. [Estructura de Archivos](#-estructura-de-archivos)
15. [Orden de Inicio](#-orden-de-inicio)
16. [Checklist de Verificación](#-checklist-de-verificación)
17. [Códigos de Error](#-códigos-de-error)
18. [Beneficios de Arquitectura](#-beneficios-de-esta-arquitectura)
19. [Próximos Pasos](#-próximos-pasos)

---

## 📋 **Descripción General**

Backend que actúa como intermediario entre el frontend y la API raíz de blockchain, con documentación completa en Swagger, autenticación JWT y arquitectura de 3 capas.

---

## 🏗️ **Arquitectura de Puertos**

### **🎯 Distribución de Servicios:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND       │    │  API RAÍZ        │
│   (React/Vue)   │    │   (Node.js)     │    │  (Blockchain)    │
│   Puerto: 3002  │───▶│   Puerto: 3001  │───▶│   Puerto: 3000  │
│                 │    │                 │    │                 │
│   Frontend UI   │    │   API REST      │    │   Smart Contracts│
│   Swagger UI    │    │   SQLite DB     │    │   Hardhat/Ethers │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🔗 URLs de Acceso:**

- **Frontend**: `http://localhost:3002`
- **Backend**: `http://localhost:3001`
- **API Raíz**: `http://localhost:3000`

### **🚀 Flujo de Comunicación:**

1. **Usuario** → Frontend (3002)
2. **Frontend** → Backend (3001)
3. **Backend** → API Raíz (3000)
4. **API Raíz** → Smart Contract

---

## 🛠️ **Tecnologías Utilizadas**

- **Node.js**: Plataforma principal para el backend
- **Express**: Framework para exponer APIs REST
- **SQLite**: Base de datos embebida, ligera y portable
- **JWT**: Autenticación y autorización
- **Swagger**: Documentación interactiva de la API
- **Axios**: Cliente HTTP para comunicación con API raíz
- **Docker**: Contenerización para portabilidad
- **Docker Compose**: Orquestación de servicios

---

## 🏛️ **Arquitectura por Capas**

### **Patrón Modular:**

```
Frontend (3002) → Backend (3001) → API Raíz (3000) → Smart Contract
                        ↓                              ↓
                    workRepository ←→ SQLite DB
```

### **Responsabilidades:**

- **Controller**: Recibe requests HTTP y coordina respuestas
- **Service**: Aplica lógica de negocio y validaciones
- **Repository**: Gestiona interacción con base de datos
- **BlockchainService**: Comunicación con API raíz

### **Flujo de Solicitudes:**

1. **Cliente** realiza petición HTTP al backend
2. **Controller** recibe y direcciona al Service
3. **Service** aplica lógica de negocio y llama Repository/BlockchainService
4. **Repository** ejecuta operaciones en SQLite
5. **BlockchainService** comunica con API raíz
6. **Respuesta** viaja de vuelta por las capas

---

## 🔐 **Autenticación JWT**

### **🔒 Endpoints Protegidos:**
- `POST /works` - Crear trabajo
- `POST /works/:id/accept` - Aceptar trabajo
- `POST /works/:id/submit` - Entregar trabajo
- `POST /works/:id/approve` - Aprobar trabajo
- `POST /works/:id/cancel` - Cancelar trabajo

### **🔓 Endpoints Públicos:**
- `GET /works` - Listar trabajos
- `GET /works/:id` - Obtener trabajo específico
- `GET /works/balance/:address` - Obtener balance USDC
- `POST /works/approve` - Aprobar gasto USDC
- `GET /works/health` - Health check

### **🚀 Flujo de Autenticación:**

#### **1. Login (Obtener JWT)**
```http
POST /users/login
Content-Type: application/json

{
  "email": "alice@mail.com",
  "password": "hashed_pass3"
}
```

**Response:**
```json
{
  "user": "alice@mail.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **2. Usar JWT en Requests**
```http
POST /works
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "worker": "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "amount": 150.75,
  "title": "Desarrollar API REST",
  "description": "API REST con Node.js y Express",
  "deadline": 1704153600
}
```

---

## 📚 **Swagger Documentation**

### **Acceso a Swagger UI:**
**🔗 [http://localhost:3001/swagger](http://localhost:3001/swagger)**

### **Características:**
- **Documentación interactiva** de todos los endpoints
- **Autenticación JWT** integrada
- **Testing directo** desde la interfaz
- **Esquemas de datos** completos
- **Ejemplos** para cada endpoint

### **Flujo de Testing en Swagger:**
1. **Login** → `POST /users/login`
2. **Copiar token** de la respuesta
3. **Hacer clic en "Authorize"** en Swagger UI
4. **Pegar token** y autorizar
5. **Probar endpoints protegidos** 🔒

### **📊 Esquemas Disponibles:**

#### **Request Schemas:**
- `CreateWorkRequest` - Crear trabajo
- `LoginRequest` - Autenticación
- `AcceptWorkRequest` - Aceptar trabajo
- `SubmitWorkRequest` - Entregar trabajo
- `ApproveWorkRequest` - Aprobar trabajo
- `CancelWorkRequest` - Cancelar trabajo
- `ApproveUSDCRequest` - Aprobar gasto USDC

#### **Response Schemas:**
- `Work` - Modelo de trabajo
- `User` - Modelo de usuario
- `Balance` - Balance USDC
- `Success` - Respuesta exitosa
- `Error` - Respuesta de error
- `LoginResponse` - Respuesta de login

---

## ⛓️ **Integración Blockchain**

### **Blockchain Service**

- **Conexión automática** a API raíz al iniciar
- **Manejo de errores** si API raíz no está disponible
- **Transacciones seguras** con Axios HTTP
- **Eventos de blockchain** para tracking

### **API REST**

- **Endpoints completos** según Swagger
- **Validaciones** de entrada
- **Manejo de errores** robusto
- **Respuestas consistentes**

### **Base de Datos**

- **Cache local** de trabajos
- **Sincronización** con blockchain
- **Campos adicionales** para blockchain data

### **📊 Flujo de Trabajo**

#### **1. Crear Trabajo**
```
POST /works
↓
Blockchain: createWork()
↓
DB: Guardar referencia local
↓
Response: { workId, transactionHash }
```

#### **2. Aceptar Trabajo**
```
POST /works/{id}/accept
↓
Blockchain: acceptWork()
↓
DB: Actualizar estado
↓
Response: { transactionHash }
```

#### **3. Entregar Trabajo**
```
POST /works/{id}/submit
↓
Blockchain: submitWork()
↓
DB: Guardar deliveryData
↓
Response: { transactionHash }
```

#### **4. Aprobar Trabajo**
```
POST /works/{id}/approve
↓
Blockchain: approveWork()
↓
DB: Marcar como completado
↓
Response: { transactionHash }
```

---

## 🚀 **Instalación y Ejecución**

### **1. Instalar Dependencias**
```bash
npm install
```

### **2. Configurar Variables de Entorno**
```bash
cp env.example .env
# Editar .env con tus valores
```

### **3. Ejecutar Backend**

#### **Local:**
```bash
node src/index.js
```

#### **Docker:**
```bash
docker-compose up
```

### **4. Verificar Funcionamiento**
- **Backend**: `http://localhost:3001/works/health`
- **Swagger**: `http://localhost:3001/swagger`

---

## ⚙️ **Configuración de Variables de Entorno**

### **Backend (.env)**
```env
# Configuración del Backend
PORT=3001
JWT_SECRET=tu_jwt_secret_super_secreto_aqui

# Configuración de API de Blockchain (raíz)
BLOCKCHAIN_API_URL=http://localhost:3000
```

### **Frontend (.env)**
```env
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_API_URL=http://localhost:3001
```

### **API Raíz (.env)**
```env
PORT=3000
BLOCKCHAIN_RPC_URL=http://localhost:8545
WORKESCROW_CONTRACT_ADDRESS=0x...
USDC_CONTRACT_ADDRESS=0x...
```

### **Configuración para Hardhat Local**
```env
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
WORKESCROW_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
USDC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### **Configuración para Sepolia Testnet**
```env
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/TU_PROJECT_ID
BLOCKCHAIN_PRIVATE_KEY=tu_private_key_de_sepolia
WORKESCROW_CONTRACT_ADDRESS=0x1234567890abcdef...
USDC_CONTRACT_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
```

---

## 🐳 **Docker Compose**

```yaml
version: '3.8'
services:
  # API Raíz - Blockchain
  api-blockchain:
    build: ./api-raiz
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - BLOCKCHAIN_RPC_URL=http://localhost:8545

  # Backend
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - BLOCKCHAIN_API_URL=http://api-blockchain:3000
    depends_on:
      - api-blockchain

  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3002:3002"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:3001
    depends_on:
      - backend
```

---

## 📊 **Endpoints de la API**

### **👥 Usuarios**
- `GET /users` - Listar usuarios
- `POST /users/register` - Registrar usuario
- `POST /users/login` - Autenticar usuario

### **💼 Trabajos (Protegidos)**
- `POST /works` - Crear trabajo 🔒
- `POST /works/:id/accept` - Aceptar trabajo 🔒
- `POST /works/:id/submit` - Entregar trabajo 🔒
- `POST /works/:id/approve` - Aprobar trabajo 🔒
- `POST /works/:id/cancel` - Cancelar trabajo 🔒

### **💼 Trabajos (Públicos)**
- `GET /works` - Listar trabajos
- `GET /works/:id` - Obtener trabajo específico

### **💰 Usuarios/Blockchain**
- `GET /works/balance/:address` - Obtener balance USDC
- `POST /works/approve` - Aprobar gasto USDC

### **🏥 Sistema**
- `GET /works/health` - Health check básico
- `GET /works/health/detailed` - Health check detallado

---

## 🧪 **Testing y Postman**

### **Colección de Postman:**
- **Archivo**: `WorkEscrow_Backend.postman_collection.json`
- **Base URL**: `http://localhost:3001`
- **Variables**: Configuradas automáticamente

### **Variables de Entorno en Postman:**
```json
{
  "baseUrl": "http://localhost:3001",
  "jwtToken": "",
  "aliceEmail": "alice@mail.com",
  "alicePassword": "hashed_pass3",
  "aliceWallet": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  "bobWallet": "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
}
```

### **Flujo de Testing:**
1. **Login** → Obtener JWT token
2. **Crear trabajo** → Con autenticación
3. **Aceptar trabajo** → Cambiar estado
4. **Entregar trabajo** → Agregar delivery data
5. **Aprobar trabajo** → Completar flujo

### **🧪 Testing con Swagger UI**

#### **1. Flujo Completo de Testing**

##### **Paso 1: Health Check**
```http
GET /works/health
```

##### **Paso 2: Login**
```http
POST /users/login
{
  "email": "alice@mail.com",
  "password": "hashed_pass3"
}
```

##### **Paso 3: Autorizar en Swagger**
- Copiar token de la respuesta
- Hacer clic en "Authorize"
- Pegar token y autorizar

##### **Paso 4: Crear Trabajo**
```http
POST /works
{
  "worker": "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "amount": 150.75,
  "title": "Desarrollar API REST",
  "description": "API REST con Node.js y Express",
  "deadline": 1704153600
}
```

##### **Paso 5: Aceptar Trabajo**
```http
POST /works/1/accept
{
  "workerId": 2
}
```

#### **2. Casos de Error**

##### **Sin Autenticación**
- Intentar crear trabajo sin JWT
- Debería devolver 401 Unauthorized

##### **Token Inválido**
- Usar token expirado o malformado
- Debería devolver 403 Forbidden

##### **Datos Inválidos**
- Enviar datos faltantes
- Debería devolver 400 Bad Request

---

## 🧪 **Testing de Arquitectura**

### **1. Verificar API Raíz (3000)**
```bash
curl http://localhost:3000/health
```

### **2. Verificar Backend (3001)**
```bash
curl http://localhost:3001/works/health
```

### **3. Verificar Frontend (3002)**
```bash
curl http://localhost:3002
```

### **4. Verificar Conectividad:**
```bash
# Verificar que todos los puertos estén abiertos
netstat -an | grep :3000
netstat -an | grep :3001
netstat -an | grep :3002
```

### **5. Testing de Blockchain**

#### **1. Health Check**
```bash
curl http://localhost:3001/works/health
curl http://localhost:3001/works/health/detailed
```

#### **2. Crear Trabajo**
```bash
curl -X POST http://localhost:3001/works \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "worker": "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "amount": 100.00,
    "title": "Desarrollar sitio web",
    "description": "Sitio web con React y TypeScript",
    "deadline": 1704067200
  }'
```

#### **3. Obtener Balance**
```bash
curl http://localhost:3001/works/balance/0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
```

---

## 📋 **Estructura de Archivos**

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.js          # Configuración Swagger
│   ├── controllers/
│   │   ├── workController.js   # Endpoints con anotaciones Swagger
│   │   └── userController.js   # Endpoints de usuarios
│   ├── services/
│   │   ├── workService.js       # Lógica de negocio
│   │   └── blockchainService.js # Comunicación con API raíz
│   ├── repositories/
│   │   └── workRepository.js    # Acceso a base de datos
│   ├── middleware/
│   │   └── authMiddleware.js    # Autenticación JWT
│   ├── db.js                    # Inicialización de base de datos
│   └── index.js                 # Servidor principal
├── data/
│   └── database.db              # Base de datos SQLite
├── package.json                 # Dependencias
├── dockerfile                   # Contenerización
├── docker-compose.yml           # Orquestación
├── env.example                  # Variables de entorno
├── WorkEscrow_Backend.postman_collection.json # Colección Postman
└── BACKEND.md                   # Esta documentación
```

---

## 🎯 **Orden de Inicio**

1. **API Raíz (3000)** - Primero (blockchain)
2. **Backend (3001)** - Segundo (depende de API Raíz)
3. **Frontend (3002)** - Tercero (depende de Backend)

---

## 📋 **Checklist de Verificación**

### **✅ Arquitectura**
- [ ] **API Raíz** funcionando en puerto 3000
- [ ] **Backend** funcionando en puerto 3001
- [ ] **Frontend** funcionando en puerto 3002
- [ ] **Comunicación** Backend → API Raíz
- [ ] **Comunicación** Frontend → Backend

### **✅ Autenticación**
- [ ] Login exitoso
- [ ] Obtener JWT token
- [ ] Usar JWT en requests protegidos
- [ ] Endpoints protegidos funcionando
- [ ] Endpoints públicos funcionando

### **✅ Swagger**
- [ ] Swagger accesible en `/swagger`
- [ ] Autenticación JWT funcionando
- [ ] Testing directo desde interfaz
- [ ] Documentación completa

### **✅ Base de Datos**
- [ ] SQLite inicializada
- [ ] Datos de prueba cargados
- [ ] Persistencia funcionando

### **✅ Health Checks**
- [ ] Health check básico
- [ ] Health check detallado
- [ ] Conectividad con API raíz

### **✅ Blockchain Integration**
- [ ] Conexión con API raíz
- [ ] Transacciones funcionando
- [ ] Manejo de errores
- [ ] Sincronización de datos

---

## 🚨 **Códigos de Error**

### **401 Unauthorized**
- No se proporcionó token
- Token expirado
- Token malformado

### **403 Forbidden**
- Token inválido
- Token no puede ser verificado

### **400 Bad Request**
- Datos de login incorrectos
- Email o password faltantes
- Datos de request inválidos

### **404 Not Found**
- Trabajo no encontrado
- Usuario no encontrado

### **500 Internal Server Error**
- Error en base de datos
- Error en comunicación con API raíz
- Error interno del servidor

### **Blockchain Errors**
- "Blockchain service no está conectado"
- "Work not found"
- "Insufficient funds"

---

## 🎯 **Beneficios de esta Arquitectura**

- **Modularidad**: Cada capa tiene responsabilidades claras
- **Portabilidad**: Docker asegura funcionamiento en cualquier entorno
- **Persistencia confiable**: SQLite con volúmenes Docker
- **Escalabilidad futura**: Estructura permite agregar nuevos servicios
- **Documentación completa**: Swagger interactivo
- **Autenticación robusta**: JWT para seguridad
- **Testing integrado**: Postman y Swagger para pruebas
- **Integración blockchain**: Comunicación transparente con smart contracts

---

## 🚀 **Próximos Pasos**

1. **Ejecutar Backend**: `node src/index.js`
2. **Acceder a Swagger**: `http://localhost:3001/swagger`
3. **Probar Autenticación**: Login y autorizar en Swagger
4. **Testing Completo**: Usar colección de Postman
5. **Verificar Arquitectura**: Health checks de todos los servicios

### **Mejoras Futuras:**
1. **Implementar autenticación** con JWT ✅
2. **Agregar middleware** de rate limiting
3. **Implementar logging** estructurado
4. **Agregar tests** automatizados
5. **Implementar webhooks** para eventos de blockchain

---

**🏗️ WorkEscrow Backend - Arquitectura Completa de 3 Capas** 🚀
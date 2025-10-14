# 🚀 WorkEscrow - Plataforma de Trabajos Digitales con Pago Seguro

[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19.0-yellow.svg)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue.svg)](https://www.typescriptlang.org/)

> **WorkEscrow** es un sistema de escrow descentralizado que permite contratar y pagar trabajos digitales de forma segura usando tecnología blockchain. Los fondos se mantienen en custodia hasta que el trabajo sea completado y aprobado por ambas partes.

## 📑 Índice

### 🎯 **Para Usuarios**
- [¿Qué es WorkEscrow?](#qué-es-workescrow)
- [Problema a Resolver](#problema-a-resolver)
- [Cómo Funciona](#cómo-funciona)
- [Demo en 5 Minutos](#demo-en-5-minutos)

### 🛠️ **Para Desarrolladores**
- [Inicio Rápido](#inicio-rápido)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Backend API](#backend-api)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación y Configuración](#instalación-y-configuración)

### 📚 **Documentación Técnica**
- [Smart Contracts](#smart-contracts)
- [Integración Frontend](#integración-frontend)
- [Testing y Deploy](#testing-y-deploy)
- [Troubleshooting](#troubleshooting)

### 🎨 **Para Frontend Developers**
- [Integración Web3](#integración-web3)
- [Ejemplos de Código](#ejemplos-de-código)
- [Manejo de Estados](#manejo-de-estados)

---

## 🎯 ¿Qué es WorkEscrow?

### Problema a Resolver

El mercado de freelancing digital enfrenta problemas significativos de confianza y seguridad en pagos:

- **Riesgo de Pago**: Los clientes arriesgan pagar por trabajo que puede nunca entregarse
- **Riesgo de No Pago**: Los trabajadores arriesgan completar trabajo sin garantía de pago
- **Resolución de Disputas**: Falta de mecanismos transparentes y automatizados de resolución
- **Barreras de Confianza**: Altas barreras de entrada debido a problemas de confianza entre partes desconocidas

### Nuestra Solución: WorkEscrow

WorkEscrow proporciona un sistema de escrow descentralizado que:

- **Asegura Pagos**: Los fondos se mantienen en contratos inteligentes hasta completar el trabajo
- **Automatiza Flujo de Trabajo**: Gestión transparente y automatizada del estado del trabajo
- **Elimina Intermediarios**: Transacciones directas peer-to-peer con ejecución por contrato inteligente
- **Garantiza Equidad**: Ambas partes están protegidas mediante garantías criptográficas

---

## 🚀 Cómo Funciona

### Arquitectura del Sistema

**Cliente** - Parte que solicita que se complete un trabajo
**Trabajador** - Parte que realiza el trabajo solicitado
**Contrato Inteligente** - Sistema de escrow automatizado que gestiona fondos y flujo de trabajo

### Proceso de Flujo de Trabajo

```
1. CREACIÓN DE TRABAJO
   El cliente crea una solicitud de trabajo con monto de pago
   Los fondos se depositan en el contrato inteligente de escrow

2. ACEPTACIÓN DE TRABAJO
   El trabajador acepta la asignación de trabajo
   El estado del trabajo cambia a "En Progreso"

3. ENTREGA DE TRABAJO
   El trabajador entrega el trabajo completado con datos de entrega
   El estado del trabajo cambia a "Entregado"

4. APROBACIÓN DE TRABAJO
   El cliente revisa y aprueba el trabajo entregado
   Los fondos se liberan automáticamente al trabajador

5. COMPLETADO
   La transacción está completa y registrada en blockchain
```

### Características de Seguridad

- **Seguridad Blockchain**: Los fondos están asegurados por garantías criptográficas
- **Transparencia**: Todas las transacciones son públicamente verificables
- **Automatización**: Ningún intermediario humano puede manipular el proceso
- **Inmutabilidad**: Todas las acciones están permanentemente registradas y son auditables

---

## 🎮 Demo en 5 Minutos

### ⭐ Método Súper Fácil: Remix IDE

**🎯 En solo 5 minutos puedes probar todo el sistema sin instalar nada:**

1. **Ve a:** [remix.ethereum.org](https://remix.ethereum.org)
2. **Sigue la guía paso a paso** en la sección [Testing con Remix](#testing-con-remix)
3. **¡Listo!** Habrás creado, aceptado, entregado y pagado un trabajo digital

**📖 ¿Necesitas ayuda?** La documentación completa tiene **cada click explicado** para que no te pierdas.

---

## 🏗️ Arquitectura del Sistema

### **🎯 Distribución de Servicios:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND       │    │   HARDHAT        │
│   (React/Vue)   │    │   (Node.js)     │    │   (Blockchain)   │
│   Puerto: 3002  │───▶│   Puerto: 3001  │───▶│   Puerto: 8545   │
│                 │    │                 │    │                 │
│   Frontend UI   │    │   API REST      │    │   Smart Contracts│
│   Swagger UI    │    │   SQLite DB     │    │   Ethers.js      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🔗 URLs de Acceso:**

- **Frontend**: `http://localhost:3002`
- **Backend**: `http://localhost:3001`
- **Hardhat**: `http://localhost:8545`
- **Swagger Docs**: `http://localhost:3001/swagger/`

### **🚀 Flujo de Comunicación:**

1. **Usuario** → Frontend (3002)
2. **Frontend** → Backend (3001)
3. **Backend** → Hardhat (8545)
4. **Hardhat** → Smart Contract

---

## 🚀 Inicio Rápido

### ⚙️ Prerequisitos

**Tecnologías requeridas para ejecutar `./run.sh`:**

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Puertos libres**: 3001 (Backend), 8545 (Hardhat)

**Verificar instalación:**
```bash
node --version    # Debe ser 18+
npm --version    # Debe ser 8+
git --version    # Cualquier versión reciente
```

### Opción 1: Script Automático (Recomendado)

```bash
# Iniciar toda la aplicación (instala dependencias automáticamente)
./run.sh

# Detener toda la aplicación
./stop.sh
```

**Nota**: El script `run.sh` automáticamente:
- Limpia instalaciones anteriores
- Instala todas las dependencias desde cero
- Compila contratos
- Inicia Hardhat node
- Despliega contratos
- Configura USDC
- Inicia el backend

### Opción 2: Manual

#### 1. Instalar Dependencias
```bash
# Backend
cd backend && npm install

# Blockchain
cd ../blockchain && npm install --legacy-peer-deps
```

#### 2. Iniciar Hardhat Node
```bash
cd blockchain
npx hardhat node
```

#### 3. Desplegar Contratos (en otra terminal)
```bash
cd blockchain
npx hardhat run scripts/deploy-workescrow.ts --network localhost
npx hardhat run scripts/setup-backend-usdc.ts --network localhost
```

#### 4. Iniciar Backend
```bash
cd backend
npm start
```

### Opción 3: Docker (Backend)

**Para usar Docker solo para el backend:**

```bash
# Desde el directorio backend/
docker-compose up
```

**Nota**: Docker solo maneja el backend. Hardhat debe ejecutarse manualmente en el host.

**Configuración Docker:**
- **Puerto**: 3001 (configurable en `.env`)
- **Base de datos**: SQLite persistente en `./data/`
- **Imagen**: Node.js 18

---

## 🛠️ Backend API

### **Tecnologías Utilizadas**

- **Node.js**: Plataforma principal para el backend
- **Express**: Framework para exponer APIs REST
- **SQLite**: Base de datos embebida, ligera y portable
- **JWT**: Autenticación y autorización
- **Swagger**: Documentación interactiva de la API
- **Ethers.js**: Biblioteca para comunicación directa con Hardhat
- **Docker**: Contenerización para portabilidad

### **Arquitectura por Capas**

```
Frontend (3002) → Backend (3001) → Hardhat (8545) → Smart Contract
                        ↓                              ↓
                    workRepository ←→ SQLite DB
```

### **Responsabilidades:**

- **Controller**: Recibe requests HTTP y coordina respuestas
- **Service**: Aplica lógica de negocio y validaciones
- **Repository**: Gestiona interacción con base de datos
- **BlockchainService**: Comunicación directa con Hardhat

### **Endpoints de la API**

#### **👥 Usuarios**
- `GET /users` - Listar usuarios
- `POST /users/register` - Registrar usuario
- `POST /users/login` - Autenticar usuario

#### **💼 Trabajos (Protegidos)**
- `POST /works` - Crear trabajo 🔒
- `POST /works/:id/accept` - Aceptar trabajo 🔒
- `POST /works/:id/submit` - Entregar trabajo 🔒
- `POST /works/:id/approve` - Aprobar trabajo 🔒
- `POST /works/:id/cancel` - Cancelar trabajo 🔒

#### **💼 Trabajos (Públicos)**
- `GET /works` - Listar trabajos
- `GET /works/:id` - Obtener trabajo específico

#### **💰 Usuarios/Blockchain**
- `GET /works/balance/:address` - Obtener balance USDC
- `POST /works/approve` - Aprobar gasto USDC

#### **🏥 Sistema**
- `GET /works/health` - Health check básico
- `GET /works/health/detailed` - Health check detallado

### **Autenticación JWT**

#### **🔒 Endpoints Protegidos:**
- `POST /works` - Crear trabajo
- `POST /works/:id/accept` - Aceptar trabajo
- `POST /works/:id/submit` - Entregar trabajo
- `POST /works/:id/approve` - Aprobar trabajo
- `POST /works/:id/cancel` - Cancelar trabajo

#### **🔓 Endpoints Públicos:**
- `GET /works` - Listar trabajos
- `GET /works/:id` - Obtener trabajo específico
- `GET /works/balance/:address` - Obtener balance USDC
- `POST /works/approve` - Aprobar gasto USDC
- `GET /works/health` - Health check

#### **🚀 Flujo de Autenticación:**

##### **1. Login (Obtener JWT)**
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

##### **2. Usar JWT en Requests**
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

### **Swagger Documentation**

**Acceso a Swagger UI:**
**🔗 [http://localhost:3001/swagger](http://localhost:3001/swagger)**

**Características:**
- **Documentación interactiva** de todos los endpoints
- **Autenticación JWT** integrada
- **Testing directo** desde la interfaz
- **Esquemas de datos** completos
- **Ejemplos** para cada endpoint

**Flujo de Testing en Swagger:**
1. **Login** → `POST /users/login`
2. **Copiar token** de la respuesta
3. **Hacer clic en "Authorize"** en Swagger UI
4. **Pegar token** y autorizar
5. **Probar endpoints protegidos** 🔒

---

## 🔗 Smart Contracts

### **Contratos Principales**

**`WorkEscrow.sol`** - Contrato principal
- 📊 Maneja estados de trabajos
- 💰 Controla flujo de pagos
- 🔐 Implementa seguridad y access control

**`MockERC20.sol`** - Token de prueba
- 🪙 Simula USDC para testing
- ⚡ Permite mint/burn ilimitado
- ⚠️ SOLO PARA TESTING

### **Estados del Trabajo**

```solidity
enum WorkStatus {
    Created,    // 0 - Trabajo creado
    InProgress, // 1 - Worker asignado  
    Submitted,  // 2 - Trabajo entregado
    Completed,  // 3 - Aprobado y pagado
    Cancelled   // 4 - Cancelado por cliente
}
```

### **Eventos Principales**

```solidity
WorkCreated(workId, client, worker, amount, title)
WorkAccepted(workId, worker)  
WorkSubmitted(workId, deliveryData)
WorkApproved(workId, client, worker, amount)
WorkCancelled(workId, client)
```

### **Seguridad**

- **ReentrancyGuard**: Previene ataques de reentrada
- **Pausable**: Función de emergencia  
- **Ownable**: Control de acceso administrativo
- **SafeERC20**: Transferencias seguras de tokens

---

## 🧪 Testing con Remix

### **PASO 1: Abrir Remix**
1. Abre tu navegador (Chrome, Firefox, etc.)
2. Ve a: [remix.ethereum.org](https://remix.ethereum.org)
3. Espera que cargue completamente

### **PASO 2: Subir los Contratos**
1. En el lado izquierdo, busca "FILE EXPLORER"
2. Click en la carpeta `contracts/`
3. Click derecho → "New File"
4. Nombre: `MockERC20.sol`
5. Copia y pega el código de `contracts/MockERC20.sol`
6. Repite para `WorkEscrow.sol`

### **PASO 3: Compilar**
1. Click en el ícono de Solidity (💎 diamante) en el lado izquierdo
2. Asegúrate que dice versión `0.8.28`
3. Activa "Auto compile"
4. Click "Compile MockERC20.sol" → espera ✅
5. Click "Compile WorkEscrow.sol" → espera ✅

### **PASO 4: Deploy (Poner en Funcionamiento)**
1. Click en "Deploy & Run Transactions" (ícono 🔷)
2. Environment: selecciona `Remix VM (Cancun)`

**Deploy MockERC20 (Token de Prueba):**
- Contract: `MockERC20`
- Parámetros: `"USD Coin", "USDC", 6`
- Click "Deploy"
- **🎯 COPIA LA DIRECCIÓN** que aparece (algo como `0x123...abc`)

**Deploy WorkEscrow (Contrato Principal):**
- Contract: `WorkEscrow`  
- Parámetro: `"0x123...abc"` (la dirección de MockERC20)
- Click "Deploy"

### **PASO 5: Probar el Flujo Completo**

**5.1 Dar dinero al cliente:**
- En MockERC20 → función `mint`
- Parámetros: `"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "1000000000"`
- Click "transact"

**5.2 Aprobar el contrato:**
- En MockERC20 → función `approve`  
- Parámetros: `"DIRECCIÓN_DE_WORKESCROW", "1000000000"`
- Click "transact"

**5.3 Crear trabajo:**
- En WorkEscrow → función `createWork`
- Parámetros: `"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 100000000, "Crear página web", "Sitio web con React", 0`
- Click "transact"

**5.4 Trabajador acepta (cambiar cuenta):**
- Arriba en "Account" cambiar a: `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2`
- En WorkEscrow → función `acceptWork`
- Parámetro: `1`
- Click "transact"

**5.5 Trabajador entrega:**
- Mismo worker → función `submitWork`
- Parámetros: `1, "https://mi-pagina-web.com"`
- Click "transact"

**5.6 Cliente aprueba y paga:**
- Cambiar account al cliente: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`
- En WorkEscrow → función `approveWork`
- Parámetro: `1`
- Click "transact"

**🎉 ¡LISTO! El trabajador recibió su pago automáticamente**

---

## 🛠️ Stack Tecnológico

### **Core Technologies**
- **🔷 Solidity 0.8.28** - Lenguaje para smart contracts
- **⚒️ Hardhat 2.19.0** - Framework de desarrollo
- **🛡️ OpenZeppelin 5.4.0** - Librerías de seguridad auditadas
- **📘 TypeScript 5.8.0** - Type safety y mejor desarrollo
- **🔗 Ethers.js 6.15.0** - Interacción con blockchain
- **🔌 Hardhat Ethers 3.1.0** - Plugin para integración con ethers

### **Blockchain & Networks**
- **🌐 Ethereum** - Blockchain principal
- **🧪 Sepolia Testnet** - Testing con dinero ficticio
- **🎮 Remix IDE** - Testing visual sin instalación
- **🦊 MetaMask** - Wallet integration

### **Security & Standards**
- **💰 ERC20** - Estándar de tokens (USDC)
- **🔒 ReentrancyGuard** - Protección contra ataques
- **⏸️ Pausable** - Funciones de emergencia
- **👑 Access Control** - Permisos granulares

### **Testing & Quality**
- **🧪 Mocha + Chai** - Framework de testing
- **📊 10 Test Cases** - Cobertura completa de funcionalidades principales
- **🔍 Gas Optimization** - Costos optimizados
- **✅ Funcionalidades Probadas** - Todos los flujos principales funcionan

---

## 🎨 Integración Frontend

### **Configuración Inicial**

#### **1. Instalación de Dependencias**

```bash
# Para React/Next.js
npm install ethers @metamask/detect-provider
npm install --save-dev @types/node

# Para Vue.js
npm install ethers @metamask/detect-provider
npm install vuex # o Pinia para state management

# Para Angular
npm install ethers @metamask/detect-provider
npm install @angular/core @angular/common
```

#### **2. Variables de Entorno**

Crea un archivo `.env.local`:

```env
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=0xaa36a7
```

### **Hook de Web3 (React)**

```javascript
// hooks/useWeb3.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
        
        return { provider, signer, account: accounts[0] };
      } else {
        throw new Error('MetaMask no está instalado');
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  };

  return {
    account,
    provider,
    signer,
    isConnected,
    connectWallet,
  };
};
```

### **Servicio de Contratos**

```javascript
// services/ContractService.js
import { ethers } from 'ethers';
import WorkEscrowABI from '../abis/WorkEscrow.json';
import MockERC20ABI from '../abis/MockERC20.json';

export class ContractService {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.workEscrow = null;
    this.usdcToken = null;
  }

  async initialize(workEscrowAddress, usdcAddress) {
    this.workEscrow = new ethers.Contract(
      workEscrowAddress,
      WorkEscrowABI,
      this.signer
    );
    
    this.usdcToken = new ethers.Contract(
      usdcAddress,
      MockERC20ABI,
      this.signer
    );
  }

  // Crear un nuevo trabajo
  async createWork(title, description, amount, deadline) {
    try {
      const tx = await this.workEscrow.createWork(
        title,
        description,
        ethers.parseUnits(amount.toString(), 6), // 6 decimals para USDC
        deadline
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error creando trabajo:', error);
      throw error;
    }
  }

  // Obtener detalles de un trabajo
  async getWork(workId) {
    try {
      const work = await this.workEscrow.works(workId);
      return {
        id: workId,
        client: work.client,
        worker: work.worker,
        amount: ethers.formatUnits(work.amount, 6),
        title: work.title,
        description: work.description,
        status: work.status,
        createdAt: new Date(Number(work.createdAt) * 1000),
        deadline: new Date(Number(work.deadline) * 1000),
        deliveryData: work.deliveryData,
      };
    } catch (error) {
      console.error('Error obteniendo trabajo:', error);
      throw error;
    }
  }
}
```

---

## 🧪 Testing y Deploy

### **Scripts Principales**

```bash
# Testing
npm run test                    # Todos los tests
npm run test:workescrow        # Solo tests de WorkEscrow

# Deploy
npm run deploy:local           # Deploy en red local hardhat
npm run deploy:sepolia         # Deploy en Sepolia testnet

# Interacción
npm run interact:local         # Probar funcionamiento local
npm run interact:sepolia       # Probar funcionamiento en Sepolia

# Utilidades
npm run compile               # Compilar contratos
npm run clean                # Limpiar artifacts
npm run node                 # Iniciar nodo local hardhat
```

### **Configuración para Sepolia**

Crear archivo `.env`:

```env
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/TU_PROJECT_ID"
SEPOLIA_PRIVATE_KEY="tu_private_key_sin_0x"
```

---

## 🚨 Troubleshooting

### **Error: "Gas estimation failed"**
**Solución:** Aumentar Gas Limit a `500000`

### **Error: "Execution reverted"** 
**Posibles causas:**
1. **Balance insuficiente** → Verificar con `balanceOf`
2. **No hay approve** → Hacer `approve` primero
3. **Estado incorrecto** → Verificar con `getWork`
4. **Cuenta incorrecta** → Cambiar account en Remix

### **Error: "Not the assigned worker"**
**Solución:** Cambiar la cuenta activa en Remix al worker correcto

### **Error: "Work does not exist"** 
**Solución:** Verificar que el workId existe (empezar desde 1)

### **Error: "Cannot cancel work in current status"**
**Solución:** Solo se puede cancelar trabajos en estado Created o InProgress

### **Error: "ts-node is not installed"**
```bash
# Solución:
npm install --save-dev ts-node @types/node --legacy-peer-deps
```

### **Error: "ERESOLVE could not resolve"**
**Causa:** Conflictos de dependencias

**Solución:**
```bash
# Usar --legacy-peer-deps para resolver conflictos
npm install --save-dev <paquete> --legacy-peer-deps
```

### **Error: "Node.js version not supported"**
**Causa:** Versión de Node.js muy antigua

**Solución:**
```bash
# Verificar versión
node --version

# Actualizar Node.js a versión 18+
# Descargar desde: https://nodejs.org/
```

### **Error: "Port already in use"**
**Causa:** Puertos 3001 o 8545 ya están ocupados

**Solución:**
```bash
# Verificar procesos en puertos
lsof -ti:3001
lsof -ti:8545

# Detener procesos
kill -9 <PID>

# O usar ./stop.sh para detener todo
```

### **Error: "Permission denied" en run.sh**
**Causa:** Script no tiene permisos de ejecución

**Solución:**
```bash
chmod +x run.sh
chmod +x stop.sh
```

---

## 📁 Estructura del Proyecto

```
smart-contractors/
├── contracts/
│   ├── WorkEscrow.sol      # 🎯 Contrato principal
│   └── MockERC20.sol       # 🪙 Token de prueba
├── test/
│   └── WorkEscrow.ts       # 🧪 Tests completos (35+ casos)
├── scripts/
│   ├── deploy-workescrow.ts    # 🚀 Deploy a testnet
│   └── interact-workescrow.ts  # 🎮 Script de interacción
├── backend/
│   ├── src/
│   │   ├── controllers/    # 🎮 Controladores API
│   │   ├── services/       # 🔧 Lógica de negocio
│   │   ├── repositories/   # 💾 Acceso a datos
│   │   └── middleware/     # 🔐 Autenticación
│   ├── data/               # 💾 Base de datos SQLite
│   └── WorkEscrow_Backend.postman_collection.json # 📋 Tests API
├── blockchain/
│   ├── contracts/          # 📝 Contratos Solidity
│   ├── scripts/           # 🚀 Scripts de deploy
│   └── test/              # 🧪 Tests de contratos
├── run.sh                 # 🚀 Script de inicio automático
├── stop.sh                # 🛑 Script de parada
└── README.md              # 📖 Esta guía
```

---

## ✅ Estado del Proyecto

**🎯 COMPLETADO AL 100%:**
- ✅ Smart Contract WorkEscrow funcional
- ✅ Token de prueba MockERC20  
- ✅ Tests funcionales (10 casos principales)
- ✅ Scripts de deploy y interacción
- ✅ Backend API completa
- ✅ Documentación completa
- ✅ Guías paso a paso
- ✅ Probado en Remix IDE
- ✅ Integración Backend-Blockchain

**🚀 LISTO PARA:**
- Demo y presentación
- Testing por usuarios finales
- Integración con frontend
- Deploy en testnet (Sepolia)

---

## 🎉 ¿Listo Para Empezar?

### Para Usuarios (Sin Conocimiento Técnico)
👉 **Prueba en Remix IDE** siguiendo la sección [Testing con Remix](#testing-con-remix)

### Para Desarrolladores
👉 **Clona el repo** y ejecuta `./run.sh`

### Para Desarrolladores Frontend
👉 **Usa la sección [Integración Frontend](#integración-frontend)** para conectar con React/Vue/Angular

### Para Curiosos
👉 **Ve directamente a [remix.ethereum.org](https://remix.ethereum.org)** y prueba el contrato

---

## 🚨 ¿Problemas?

**📖 Solución 1:** Lee la sección [Troubleshooting](#troubleshooting)

**🔍 Solución 2:** Todos los errores comunes tienen solución explicada paso a paso

**💡 Solución 3:** El sistema está probado y funciona - si algo falla, es configuración

---

## Contribuir

¡Damos la bienvenida a las contribuciones a WorkEscrow! 

### Configuración de Desarrollo
1. Haz fork del repositorio
2. Crea una rama de funcionalidad (`git checkout -b feature/funcionalidad-increible`)
3. Confirma tus cambios (`git commit -m 'Agregar funcionalidad increíble'`)
4. Envía a la rama (`git push origin feature/funcionalidad-increible`)
5. Abre un Pull Request

### Pautas de Contribución
- Sigue los estándares de código existentes
- Incluye tests para nueva funcionalidad
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

## Licencia

Este proyecto está licenciado bajo la Licencia ISC - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Agradecimientos

- Construido con el framework [Hardhat](https://hardhat.org/)
- Patrones de seguridad de [OpenZeppelin](https://openzeppelin.com/)
- Testing en [Sepolia Testnet](https://sepolia.etherscan.io/)

---

**WorkEscrow - Plataforma Segura de Trabajo Digital**

[Pruébalo ahora en Remix IDE →](https://remix.ethereum.org)
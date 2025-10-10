# 🔄 CHANGES.md - API Blockchain Mínima

## 📋 **Resumen de Validación**

**Fecha:** $(date)  
**Estado:** ✅ **API BLOCKCHAIN MÍNIMA REQUERIDA**

---

## 🎯 **Arquitectura Correcta**

### **Backend (Puerto 3001) - VALIDACIONES Y LÓGICA**
- ✅ **SQLite** para validaciones de negocio
- ✅ **JWT** para autenticación
- ✅ **Validaciones** de estados, permisos, datos
- ✅ **Lógica de negocio** completa

### **API Blockchain (Puerto 3000) - SOLO TRANSACCIONES**
- 🔄 **Solo transacciones** de blockchain
- 🔄 **Sin validaciones** de negocio
- 🔄 **Sin autenticación** JWT
- 🔄 **Mínima** y directa

---

## 🛠️ **API Blockchain Mínima Requerida**

### **Estructura de Archivos:**
```
api-blockchain/
├── src/
│   ├── controllers/
│   │   ├── workController.js    # Solo transacciones de trabajos
│   │   └── userController.js    # Solo balance y approve USDC
│   ├── services/
│   │   └── contractService.js   # Interacción con contratos
│   ├── config/
│   │   └── contracts.js         # Direcciones de contratos
│   └── index.js                 # Servidor Express
├── package.json
└── .env.example
```

### **Endpoints Mínimos (Sin Validaciones):**

#### **1. Trabajos - Solo Transacciones Blockchain**

```javascript
// POST /works - Crear trabajo en blockchain
POST /works
{
  "worker": "0x...",           // Dirección del worker
  "amount": "100.50",          // Cantidad como string
  "title": "Título",           // Título del trabajo
  "description": "Descripción", // Descripción
  "deadline": "1704153600"     // Timestamp como string
}
// Response: { workId, transactionHash }

// POST /works/{id}/accept - Aceptar trabajo en blockchain
POST /works/{id}/accept
// Response: { transactionHash }

// POST /works/{id}/submit - Entregar trabajo en blockchain
POST /works/{id}/submit
{
  "deliveryData": "https://..." // Datos de entrega
}
// Response: { transactionHash }

// POST /works/{id}/approve - Aprobar trabajo en blockchain
POST /works/{id}/approve
// Response: { transactionHash }

// POST /works/{id}/cancel - Cancelar trabajo en blockchain
POST /works/{id}/cancel
// Response: { transactionHash }

// GET /works/{id} - Obtener trabajo del blockchain
GET /works/{id}
// Response: { work data from contract }
```

#### **2. Usuarios - Solo Balance y Approve**

```javascript
// GET /users/balance/{address} - Balance USDC
GET /users/balance/{address}
// Response: { balance: "1000.50" }

// POST /users/approve - Aprobar gasto USDC
POST /users/approve
{
  "spender": "0x...",    // Dirección que puede gastar
  "amount": "1000.00"    // Cantidad como string
}
// Response: { transactionHash }
```

#### **3. Health Checks**

```javascript
// GET /health - Health check básico
GET /health
// Response: { success: true, status: "healthy" }

// GET /health/detailed - Health check detallado
GET /health/detailed
// Response: { success: true, status: "healthy", services: {...} }
```

---

## 🔄 **Flujo Correcto**

### **1. Crear Trabajo**
```
Frontend → Backend (validaciones SQLite) → API Blockchain (transacción) → Smart Contract
```

### **2. Aceptar Trabajo**
```
Frontend → Backend (validar estado en BD) → API Blockchain (transacción) → Smart Contract
```

### **3. Entregar Trabajo**
```
Frontend → Backend (validar worker y estado) → API Blockchain (transacción) → Smart Contract
```

### **4. Aprobar Trabajo**
```
Frontend → Backend (validar cliente y estado) → API Blockchain (transacción + pago) → Smart Contract
```

---

## 📊 **Responsabilidades Claramente Separadas**

| Componente | Responsabilidades |
|------------|-------------------|
| **Frontend** | UI/UX, formularios, mostrar datos |
| **Backend** | ✅ Validaciones de negocio, ✅ Autenticación JWT, ✅ SQLite, ✅ Lógica de estados |
| **API Blockchain** | 🔄 Solo transacciones blockchain, 🔄 Interacción con contratos |

---

## 🚀 **Implementación API Blockchain**

### **Dependencias Mínimas:**
```json
{
  "express": "^4.18.0",
  "ethers": "^6.15.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### **Configuración (.env):**
```env
PORT=3000
BLOCKCHAIN_RPC_URL=http://localhost:8545
WORKESCROW_CONTRACT_ADDRESS=0x...
USDC_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
```

### **Ejemplo de Controller Mínimo:**
```javascript
// workController.js - Solo transacciones
const createWork = async (req, res) => {
  try {
    const { worker, amount, title, description, deadline } = req.body;
    
    // NO VALIDACIONES - Solo transacción
    const tx = await contractService.createWork(
      worker, 
      ethers.parseUnits(amount, 6), 
      title, 
      description, 
      deadline
    );
    
    res.json({
      success: true,
      data: {
        workId: tx.workId,
        transactionHash: tx.hash
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## ✅ **Ventajas de Esta Arquitectura**

1. **Separación clara** de responsabilidades
2. **Backend robusto** con todas las validaciones
3. **API Blockchain simple** y mantenible
4. **Fácil testing** de cada componente
5. **Escalabilidad** independiente

---

## 🎯 **Próximos Pasos**

1. **Crear API Blockchain mínima** con solo transacciones
2. **Mantener Backend actual** (ya está bien)
3. **Probar integración** completa
4. **Documentar** flujo de comunicación

---

**✅ NOTA:** El Backend actual está perfecto como pasamano. Solo necesitamos crear la API Blockchain mínima que maneje las transacciones de blockchain sin validaciones de negocio.

# TODO - Inconsistencias en Documentación WorkEscrow

## 🎯 Objetivo
Unificar y corregir inconsistencias encontradas en la documentación del proyecto WorkEscrow para mantener coherencia entre todos los archivos `.md`.

---

## 📋 Lista de Tareas Específicas

### 1. **Direcciones de Contratos Inconsistentes**
**Archivo:** `DOCUMENTACION_COMPLETA.md` (línea 375)
**Problema:** Dirección USDC Sepolia hardcodeada que puede estar desactualizada
```solidity
address constant SEPOLIA_USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
```
**Acción:** Verificar si esta dirección es correcta y actualizar en todos los archivos que la mencionen.

### 2. **Configuración de Variables de Entorno**
**Archivos:** `INTEGRACION_FRONTEND.md` vs `DOCUMENTACION_COMPLETA.md`
**Problema:** Diferentes nombres y formatos de variables de entorno
- `INTEGRACION_FRONTEND.md` usa: `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `DOCUMENTACION_COMPLETA.md` usa: `SEPOLIA_RPC_URL`
**Acción:** Estandarizar nombres de variables en todos los archivos.

### 3. **Scripts de Deploy Conflictivos**
**Archivos:** `package.json` vs documentación
**Problema:** 
- `README.md` menciona: `npm run deploy:local`
- `DOCUMENTACION_COMPLETA.md` menciona: `npx hardhat run scripts/deploy-workescrow.js`
**Acción:** Verificar qué scripts existen realmente y actualizar documentación.

### 4. **Configuración de Redes Inconsistente**
**Archivos:** `INTEGRACION_FRONTEND.md` vs `TECNOLOGIAS_DETALLADAS.md`
**Problema:** Diferentes configuraciones de redes
- Chain ID para Sepolia: `0xaa36a7` vs `11155111`
- RPC URLs diferentes entre archivos
**Acción:** Estandarizar configuración de redes en todos los archivos.

### 5. **Dependencias y Versiones**
**Archivos:** `package.json` vs `TECNOLOGIAS_DETALLADAS.md`
**Problema:** Versiones mencionadas en documentación pueden no coincidir con `package.json` actual
**Acción:** Verificar y actualizar versiones en documentación.

### 6. **Estructura de Archivos Mencionada**
**Archivos:** `README.md` vs estructura real del proyecto
**Problema:** `README.md` menciona estructura que puede no coincidir con la actual
**Acción:** Verificar estructura real vs documentada.

### 7. **Comandos de Testing**
**Archivos:** `DOCUMENTACION_COMPLETA.md` vs `README.md`
**Problema:** Diferentes comandos para ejecutar tests
- `npm run test:workescrow` vs `npx hardhat test test/WorkEscrow.ts`
**Acción:** Estandarizar comandos de testing.

### 8. **Configuración de Docker**
**Archivo:** `backend/BACKEND.md`
**Problema:** Documentación de Docker puede no coincidir con archivos reales
**Acción:** Verificar que `docker-compose.yml` y `Dockerfile` existan y funcionen.

---

## 🔧 Tareas de Verificación

### A. **Verificar Archivos Físicos**
- [ ] ¿Existe `docker-compose.yml` en `/backend/`?
- [ ] ¿Existe `Dockerfile` en `/backend/`?
- [ ] ¿Los scripts mencionados en `package.json` existen?
- [ ] ¿Las direcciones de contratos son correctas?

### B. **Verificar Consistencia de Comandos**
- [ ] Todos los comandos `npm run` mencionados existen en `package.json`
- [ ] Todos los scripts de Hardhat mencionados existen
- [ ] Variables de entorno son consistentes entre archivos

### C. **Verificar Configuraciones**
- [ ] Chain IDs son consistentes
- [ ] RPC URLs son correctas
- [ ] Direcciones de contratos son válidas
- [ ] Versiones de dependencias coinciden

---

## 📝 Formato para Próximos Prompts

### Para cada tarea, usar este formato:

```
**TAREA:** [Número] - [Título específico]
**ARCHIVOS AFECTADOS:** [Lista de archivos]
**PROBLEMA ESPECÍFICO:** [Descripción exacta del problema]
**ACCIÓN REQUERIDA:** [Qué hacer exactamente]
**COMANDO DE VERIFICACIÓN:** [Cómo verificar que está corregido]
```

### Ejemplo de prompt específico:

```
**TAREA:** 1 - Verificar direcciones de contratos USDC
**ARCHIVOS AFECTADOS:** DOCUMENTACION_COMPLETA.md, INTEGRACION_FRONTEND.md
**PROBLEMA ESPECÍFICO:** Dirección USDC Sepolia hardcodeada en línea 375 de DOCUMENTACION_COMPLETA.md
**ACCIÓN REQUERIDA:** 
1. Verificar si 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 es la dirección correcta de USDC en Sepolia
2. Buscar todas las menciones de esta dirección en otros archivos
3. Actualizar o confirmar la dirección en todos los archivos
**COMANDO DE VERIFICACIÓN:** `grep -r "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" .`
```

---

## 🎯 Prioridades

### **Alta Prioridad:**
1. Direcciones de contratos (afecta funcionalidad)
2. Variables de entorno (afecta configuración)
3. Scripts de deploy (afecta desarrollo)

### **Media Prioridad:**
4. Configuración de redes
5. Comandos de testing
6. Dependencias y versiones

### **Baja Prioridad:**
7. Estructura de archivos
8. Documentación de Docker

---

## ✅ Criterios de Completado

Para cada tarea:
- [ ] Verificar que la información es correcta
- [ ] Actualizar todos los archivos afectados
- [ ] Probar que los comandos/scripts funcionan
- [ ] Documentar cambios realizados
- [ ] Marcar como completado en este TODO

---

**Fecha de creación:** $(date)
**Estado:** Pendiente de ejecución
**Responsable:** [Tu nombre]

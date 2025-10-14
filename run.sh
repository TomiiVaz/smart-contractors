#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando WorkEscrow - Smart Contractors${NC}"
echo "================================================"

# Función para manejar errores
handle_error() {
    echo -e "${RED}❌ Error en: $1${NC}"
    echo -e "${YELLOW}💡 Revisa los logs arriba para más detalles${NC}"
    exit 1
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "blockchain" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
    exit 1
fi

# 2. Limpiar e instalar dependencias (como si fuera nuevo)
echo -e "${YELLOW}🧹 Limpiando instalaciones anteriores...${NC}"
rm -rf backend/node_modules blockchain/node_modules
rm -f backend/package-lock.json blockchain/package-lock.json
rm -f hardhat.log
rm -rf artifacts cache

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"

echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
(cd backend && npm install) || handle_error "Instalación de dependencias del backend"

echo -e "${YELLOW}📦 Instalando dependencias de blockchain...${NC}"
(cd blockchain && npm install --legacy-peer-deps) || handle_error "Instalación de dependencias de blockchain"

# 3. Compilar contratos
echo -e "${YELLOW}🔨 Compilando contratos...${NC}"
(cd blockchain && npx hardhat compile) || handle_error "Compilación de contratos"

# 4. Iniciar Hardhat node en background
echo -e "${YELLOW}🌐 Iniciando Hardhat node...${NC}"
(cd blockchain && npx hardhat node > ../hardhat.log 2>&1) &
HARDHAT_PID=$!

# Esperar a que Hardhat esté listo
echo -e "${YELLOW}⏳ Esperando a que Hardhat esté listo...${NC}"
sleep 5

# Verificar que Hardhat esté corriendo
if ! curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null; then
    echo -e "${RED}❌ Error: No se pudo conectar a Hardhat en puerto 8545${NC}"
    kill $HARDHAT_PID 2>/dev/null
    handle_error "Conexión a Hardhat"
fi

echo -e "${GREEN}✅ Hardhat node iniciado correctamente (PID: $HARDHAT_PID)${NC}"

# 5. Desplegar contratos
echo -e "${YELLOW}📋 Desplegando contratos...${NC}"
(cd blockchain && npx hardhat run scripts/deploy-workescrow.ts --network localhost) || handle_error "Despliegue de contratos"

# 6. Configurar USDC para el backend
echo -e "${YELLOW}💰 Configurando USDC para el backend...${NC}"
(cd blockchain && npx hardhat run scripts/setup-backend-usdc.ts --network localhost) || handle_error "Configuración de USDC"

# 7. Iniciar backend
echo -e "${YELLOW}🔧 Iniciando backend...${NC}"
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
sleep 3

# Verificar que el backend esté corriendo
if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend no responde en /health, pero puede estar iniciando...${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Aplicación iniciada correctamente!${NC}"
echo "================================================"
echo -e "${BLUE}📊 Servicios disponibles:${NC}"
echo -e "  🌐 Hardhat Node: http://localhost:8545"
echo -e "  🔧 Backend API: http://localhost:3001"
echo -e "  📚 Swagger Docs: http://localhost:3001/swagger/"
echo ""
echo -e "${BLUE}🔑 Cuentas de prueba (Hardhat):${NC}"
echo -e "  👤 Alice: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
echo -e "  👤 Bob: 0xAb8483F64d9C6d1EcF9b849Ae677d3314C5F4c4"
echo -e "  👤 Charlie: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"
echo -e "  👤 Diana: 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabab"
echo ""
echo -e "${BLUE}🧪 Para probar la API:${NC}"
echo -e "  📋 Postman Collection: backend/WorkEscrow_Backend.postman_collection.json"
echo -e "  📖 Documentación: backend/BACKEND.md"
echo ""
echo -e "${YELLOW}💡 Para detener la aplicación: Ctrl+C${NC}"
echo -e "${YELLOW}💡 Logs de Hardhat: tail -f hardhat.log${NC}"

# Función de limpieza al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    kill $HARDHAT_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Mantener el script corriendo
echo -e "${BLUE}🔄 Aplicación corriendo... Presiona Ctrl+C para detener${NC}"
wait

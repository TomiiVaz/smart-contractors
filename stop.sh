#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Deteniendo WorkEscrow - Smart Contractors${NC}"
echo "================================================"

# Detener procesos en puertos específicos
echo -e "${YELLOW}🔍 Buscando procesos en puertos 3001 y 8545...${NC}"

# Detener proceso en puerto 3001 (Backend)
BACKEND_PID=$(lsof -ti:3001)
if [ ! -z "$BACKEND_PID" ]; then
    echo -e "${YELLOW}🔧 Deteniendo backend (PID: $BACKEND_PID)...${NC}"
    kill -9 $BACKEND_PID
    echo -e "${GREEN}✅ Backend detenido${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró proceso en puerto 3001${NC}"
fi

# Detener proceso en puerto 8545 (Hardhat)
HARDHAT_PID=$(lsof -ti:8545)
if [ ! -z "$HARDHAT_PID" ]; then
    echo -e "${YELLOW}🌐 Deteniendo Hardhat node (PID: $HARDHAT_PID)...${NC}"
    kill -9 $HARDHAT_PID
    echo -e "${GREEN}✅ Hardhat node detenido${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró proceso en puerto 8545${NC}"
fi

# Detener contenedores Docker si están corriendo
echo -e "${YELLOW}🐳 Verificando contenedores Docker...${NC}"
if docker ps | grep -q "backend-sqlite"; then
    echo -e "${YELLOW}🐳 Deteniendo contenedor backend-sqlite...${NC}"
    docker-compose -f backend/docker-compose.yml down
    echo -e "${GREEN}✅ Contenedor Docker detenido${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontraron contenedores Docker corriendo${NC}"
fi

# Limpiar archivos temporales
echo -e "${YELLOW}🧹 Limpiando archivos temporales...${NC}"
if [ -f "hardhat.log" ]; then
    rm hardhat.log
    echo -e "${GREEN}✅ Log de Hardhat eliminado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Todos los servicios han sido detenidos${NC}"
echo -e "${BLUE}💡 Para iniciar nuevamente: ./run.sh${NC}"

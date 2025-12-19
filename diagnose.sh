#!/bin/bash

# Script de diagnóstico para UI Ollama
# Este script verifica la configuración y ayuda a identificar problemas

echo "=========================================="
echo "  Diagnóstico de UI Ollama"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# 1. Verificar Ollama
print_check "Verificando Ollama..."
if command -v ollama &> /dev/null; then
    OLLAMA_VERSION=$(ollama --version 2>&1 | head -n 1)
    print_success "Ollama instalado: $OLLAMA_VERSION"
    
    # Verificar servicio
    if curl -s http://localhost:11434/api/tags &> /dev/null; then
        print_success "Ollama está ejecutándose en http://localhost:11434"
        
        # Obtener modelos
        RESPONSE=$(curl -s http://localhost:11434/api/tags)
        MODELS_COUNT=$(echo "$RESPONSE" | grep -o '"name"' | wc -l)
        
        if [ "$MODELS_COUNT" -gt 0 ]; then
            print_success "Modelos detectados: $MODELS_COUNT"
            echo "Modelos disponibles:"
            echo "$RESPONSE" | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/  - \1/'
        else
            print_warning "No hay modelos instalados"
            echo "Instala un modelo con: ollama pull llama3.3"
        fi
    else
        print_error "Ollama no responde en http://localhost:11434"
        echo "Solución: sudo systemctl start ollama"
    fi
else
    print_error "Ollama no está instalado"
    echo "Instala con: curl -fsSL https://ollama.ai/install.sh | sh"
fi

echo ""

# 2. Verificar Node.js y npm
print_check "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js no está instalado"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm instalado: v$NPM_VERSION"
else
    print_error "npm no está instalado"
fi

echo ""

# 3. Verificar PM2
print_check "Verificando PM2..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 instalado: v$PM2_VERSION"
    
    # Verificar proceso
    if pm2 list | grep -q "uiollama"; then
        STATUS=$(pm2 list | grep "uiollama" | awk '{print $10}')
        if [[ "$STATUS" == "online" ]]; then
            print_success "La aplicación está ejecutándose"
        else
            print_error "La aplicación está detenida (status: $STATUS)"
            echo "Solución: pm2 restart uiollama"
        fi
    else
        print_warning "La aplicación no está registrada en PM2"
        echo "Solución: pm2 start npm --name 'uiollama' -- start"
    fi
else
    print_error "PM2 no está instalado"
fi

echo ""

# 4. Verificar archivo .env.local
print_check "Verificando configuración..."
if [ -f ".env.local" ]; then
    print_success "Archivo .env.local existe"
    
    OLLAMA_URL=$(grep "OLLAMA_API_URL" .env.local | cut -d '=' -f2)
    if [ ! -z "$OLLAMA_URL" ]; then
        print_success "OLLAMA_API_URL configurada: $OLLAMA_URL"
    else
        print_error "OLLAMA_API_URL no está configurada en .env.local"
    fi
else
    print_error "Archivo .env.local no existe"
    echo "Solución: Crea el archivo con:"
    echo "echo 'OLLAMA_API_URL=http://localhost:11434' > .env.local"
fi

echo ""

# 5. Verificar build de Next.js
print_check "Verificando build de Next.js..."
if [ -d ".next" ]; then
    print_success "Directorio .next existe"
    
    BUILD_TIME=$(stat -c %y .next 2>/dev/null || stat -f "%Sm" .next)
    ENV_TIME=$(stat -c %y .env.local 2>/dev/null || stat -f "%Sm" .env.local 2>/dev/null || echo "N/A")
    
    echo "  Build: $BUILD_TIME"
    echo "  .env.local: $ENV_TIME"
    
    if [[ "$ENV_TIME" > "$BUILD_TIME" ]] 2>/dev/null; then
        print_warning ".env.local es más reciente que el build"
        echo "Solución: npm run build && pm2 restart uiollama"
    fi
else
    print_error "No se encuentra el build (.next)"
    echo "Solución: npm run build"
fi

echo ""

# 6. Verificar API de la aplicación
print_check "Verificando API de la aplicación..."
if curl -s http://localhost:3000 &> /dev/null; then
    print_success "Aplicación responde en http://localhost:3000"
    
    # Verificar endpoint de modelos
    MODELS_RESPONSE=$(curl -s http://localhost:3000/api/models)
    if echo "$MODELS_RESPONSE" | grep -q '"models"'; then
        MODELS_API_COUNT=$(echo "$MODELS_RESPONSE" | grep -o '"name"' | wc -l)
        if [ "$MODELS_API_COUNT" -gt 0 ]; then
            print_success "API /api/models responde correctamente con $MODELS_API_COUNT modelos"
        else
            print_warning "API /api/models responde pero sin modelos"
            echo "Respuesta: $MODELS_RESPONSE"
        fi
    else
        print_error "API /api/models no responde correctamente"
        echo "Respuesta: $MODELS_RESPONSE"
    fi
else
    print_error "La aplicación no responde en http://localhost:3000"
    echo "Solución: pm2 restart uiollama"
fi

echo ""

# 7. Verificar puertos
print_check "Verificando puertos..."
if lsof -Pi :3000 -sTCP:LISTEN -t &> /dev/null || ss -ltn | grep -q ":3000 "; then
    print_success "Puerto 3000 está en uso (aplicación)"
else
    print_error "Puerto 3000 no está en uso"
fi

if lsof -Pi :11434 -sTCP:LISTEN -t &> /dev/null || ss -ltn | grep -q ":11434 "; then
    print_success "Puerto 11434 está en uso (Ollama)"
else
    print_error "Puerto 11434 no está en uso"
fi

echo ""

# Resumen y soluciones
echo "=========================================="
echo "  Resumen y Soluciones Comunes"
echo "=========================================="
echo ""

echo "Si los modelos no aparecen en la interfaz:"
echo ""
echo "1. Verifica que Ollama esté ejecutándose:"
echo "   curl http://localhost:11434/api/tags"
echo ""
echo "2. Verifica que la API de la app funcione:"
echo "   curl http://localhost:3000/api/models"
echo ""
echo "3. Si .env.local cambió después del build:"
echo "   npm run build"
echo "   pm2 restart uiollama"
echo ""
echo "4. Ver logs de la aplicación:"
echo "   pm2 logs uiollama"
echo ""
echo "5. Si todo falla, reinstala:"
echo "   pm2 delete uiollama"
echo "   rm -rf .next"
echo "   npm install"
echo "   npm run build"
echo "   pm2 start npm --name 'uiollama' -- start"
echo ""

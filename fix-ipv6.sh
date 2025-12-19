#!/bin/bash

# Script de solución rápida para el problema de IPv6
# Este script corrige el error ECONNREFUSED ::1:11434

echo "=========================================="
echo "  Solución rápida: IPv6 -> IPv4"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info "Actualizando .env.local para usar 127.0.0.1 en lugar de localhost..."

# Hacer backup del archivo actual
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    print_success "Backup creado: .env.local.backup"
fi

# Crear nuevo .env.local con 127.0.0.1
echo "OLLAMA_API_URL=http://127.0.0.1:11434" > .env.local
print_success "Archivo .env.local actualizado"

echo ""
print_info "Reconstruyendo la aplicación..."
npm run build

echo ""
print_info "Reiniciando PM2..."
pm2 restart uiollama

echo ""
print_success "¡Listo! Espera unos segundos y prueba la aplicación"
echo ""
echo "Para verificar:"
echo "  curl http://localhost:3000/api/models"
echo ""
echo "O ejecuta el diagnóstico completo:"
echo "  ./diagnose.sh"

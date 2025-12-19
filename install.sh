#!/bin/bash

# Script de instalación automática para UI Ollama
# Este script instala y configura la aplicación (sin Ollama)

set -e  # Salir si hay algún error

echo "================================================"
echo "   Instalador UI Ollama - Servidor Linux"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Detectar si se ejecuta como root y ajustar comandos
if [[ $EUID -eq 0 ]]; then
    SUDO=""
    print_warning "Ejecutando como root. Se recomienda usar un usuario normal con sudo."
else
    SUDO="sudo"
fi

print_info "Iniciando instalación..."
echo ""

# Paso 1: Verificar/Instalar Node.js
print_info "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js ya está instalado: $NODE_VERSION"
else
    print_warning "Node.js no encontrado. Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | $SUDO -E bash -
    $SUDO apt install -y nodejs
    print_success "Node.js instalado correctamente"
fi

# Verificar versión de Node.js
NODE_MAJOR_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
    print_error "Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo ""

# Paso 2: Instalar dependencias del proyecto
print_info "Instalando dependencias del proyecto..."
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

npm install
print_success "Dependencias instaladas"
echo ""

# Paso 3: Construir la aplicación
print_info "Construyendo la aplicación para producción..."
npm run build
print_success "Aplicación construida"
echo ""

# Paso 4: Instalar PM2
print_info "Verificando PM2..."
if command -v pm2 &> /dev/null; then
    print_success "PM2 ya está instalado"
else
    print_warning "PM2 no encontrado. Instalando PM2..."
    $SUDO npm install -g pm2
    print_success "PM2 instalado correctamente"
fi
echo ""

# Paso 5: Configurar archivo .env.local
print_info "Configurando variables de entorno..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        print_success "Archivo .env.local creado"
    else
        echo "OLLAMA_API_URL=http://localhost:11434" > .env.local
        print_success "Archivo .env.local creado con configuración por defecto"
    fi
else
    print_success "Archivo .env.local ya existe"
fi
echo ""

# Paso 6: Configurar PM2
print_info "Configurando PM2 para ejecutar la aplicación..."

# Detener proceso anterior si existe
pm2 delete uiollama 2>/dev/null || true

# Iniciar aplicación con PM2
pm2 start npm --name "uiollama" -- start
print_success "Aplicación iniciada con PM2"

# Configurar PM2 para arranque automático
print_info "Configurando inicio automático..."
$SUDO env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save
print_success "Inicio automático configurado"
echo ""

# Paso 7: Preguntar sobre Nginx
echo ""
print_info "¿Deseas instalar y configurar Nginx como reverse proxy? (recomendado para producción)"
read -p "Instalar Nginx? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[SsYy]$ ]]; then
    print_info "Instalando Nginx..."
    $SUDO apt install -y nginx
    
    # Pedir dominio o IP
    echo ""
    print_info "Configuración de Nginx"
    read -p "Ingresa tu dominio o IP del servidor (ej: example.com o 192.168.1.100): " DOMAIN
    
    # Crear configuración de Nginx
    NGINX_CONF="/etc/nginx/sites-available/uiollama"
    
    $SUDO tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Habilitar sitio
    $SUDO ln -sf $NGINX_CONF /etc/nginx/sites-enabled/uiollama
    
    # Verificar configuración
    $SUDO nginx -t
    
    # Reiniciar Nginx
    $SUDO systemctl restart nginx
    $SUDO systemctl enable nginx
    
    print_success "Nginx configurado y en ejecución"
    
    # Preguntar sobre SSL
    echo ""
    print_info "¿Deseas instalar certificado SSL con Let's Encrypt? (requiere dominio válido)"
    read -p "Instalar SSL? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        print_info "Instalando Certbot..."
        $SUDO apt install -y certbot python3-certbot-nginx
        
        print_info "Obteniendo certificado SSL..."
        $SUDO certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || print_warning "No se pudo obtener el certificado SSL. Configúralo manualmente más tarde."
    fi
fi

echo ""

# Paso 8: Configurar Firewall
print_info "¿Deseas configurar el firewall (UFW)?"
read -p "Configurar firewall? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[SsYy]$ ]]; then
    print_info "Configurando UFW..."
    
    # Instalar UFW si no está instalado
    $SUDO apt install -y ufw
    
    # Permitir SSH primero (importante!)
    $SUDO ufw allow ssh
    
    # Permitir puertos web
    if command -v nginx &> /dev/null; then
        $SUDO ufw allow 'Nginx Full'
    else
        $SUDO ufw allow 3000/tcp
    fi
    
    # Habilitar UFW
    $SUDO ufw --force enable
    
    print_success "Firewall configurado"
    $SUDO ufw status
fi

echo ""
echo "================================================"
echo "       ✓ Instalación completada"
echo "================================================"
echo ""

# Mostrar información de acceso
print_success "La aplicación está en ejecución!"
echo ""
print_info "Información de acceso:"
echo ""

if command -v nginx &> /dev/null && [ ! -z "$DOMAIN" ]; then
    echo "  🌐 URL: http://$DOMAIN"
    if $SUDO certbot certificates 2>/dev/null | grep -q "Certificate Name: $DOMAIN"; then
        echo "  🔒 URL segura: https://$DOMAIN"
    fi
else
    echo "  🌐 URL local: http://localhost:3000"
    IP=$(hostname -I | awk '{print $1}')
    echo "  🌐 URL red: http://$IP:3000"
fi

echo ""
print_info "Comandos útiles:"
echo "  - Ver logs:          pm2 logs uiollama"
echo "  - Reiniciar app:     pm2 restart uiollama"
echo "  - Estado de app:     pm2 status"
echo "  - Detener app:       pm2 stop uiollama"
echo "  - Monitorear:        pm2 monit"
echo ""

print_warning "Nota: Asegúrate de que Ollama esté instalado y ejecutándose"
print_info "Para instalar Ollama: curl -fsSL https://ollama.ai/install.sh | sh"
echo ""
print_success "¡Instalación finalizada con éxito!"

# Chat UI - Interfaz para Ollama con Next.js

Una interfaz de chat moderna y elegante construida con Next.js 14, TypeScript y Tailwind CSS, integrada con Ollama para ejecutar modelos de lenguaje localmente.

## 🚀 Características

- ✨ Interfaz moderna similar a ChatGPT
- 🦙 Integración con Ollama para ejecutar modelos localmente
- 🔄 Selector de modelos dinámico
- 💬 Chat en tiempo real
- 🎨 Diseño responsive con Tailwind CSS
- 🌙 Soporte para modo oscuro
- ⚡ Server-side rendering con Next.js 14
- 📱 Optimizado para dispositivos móviles
- 🔄 Renderizado de Markdown en las respuestas

## 📋 Requisitos previos

- Node.js 18+ 
- Ollama instalado y ejecutándose

## 🦙 Instalación de Ollama

Primero, instala Ollama desde [ollama.ai](https://ollama.ai):

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

Luego, descarga un modelo:
```bash
ollama pull llama2
# o cualquier otro modelo como:
# ollama pull mistral
# ollama pull codellama
# ollama pull llama3
```

Inicia el servidor de Ollama:
```bash
ollama serve
```

## 🛠️ Instalación

1. Instala las dependencias:

```bash
npm install
```

2. (Opcional) Crea un archivo `.env.local` si quieres personalizar la URL de Ollama:

```bash
cp .env.local.example .env.local
```

Por defecto, la aplicación se conecta a `http://localhost:11434`.

## � Instalación automática con script

Para una instalación rápida en servidor Linux, puedes usar el script de instalación automatizado:

```bash
# Descargar o clonar el proyecto
git clone https://github.com/tu-usuario/uiollama.git
cd uiollama

# Dar permisos de ejecución al script
chmod +x install.sh

# Ejecutar el script de instalación
./install.sh
```

El script instalará y configurará automáticamente:
- ✅ Node.js 18+ (si no está instalado)
- ✅ Dependencias del proyecto
- ✅ Build de producción
- ✅ PM2 para gestión de procesos
- ✅ Nginx como reverse proxy (opcional)
- ✅ Certificado SSL con Let's Encrypt (opcional)
- ✅ Firewall UFW (opcional)

**Nota:** El script NO instala Ollama. Debes instalarlo manualmente antes:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.3  # o el modelo que prefieras
```

## �🚦 Uso

### Modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

## 📂 Estructura del proyecto

```
uiollama/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts      # API route para Ollama
│   │   └── models/
│   │       └── route.ts      # API route para listar modelos
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── ChatInterface.tsx     # Componente principal del chat
│   ├── ChatInput.tsx         # Input para mensajes
│   ├── Header.tsx            # Header de la aplicación
│   ├── MessageBubble.tsx     # Burbuja de mensaje individual
│   ├── MessageList.tsx       # Lista de mensajes
│   └── ModelSelector.tsx     # Selector de modelos de Ollama
├── types/
│   └── chat.ts               # Tipos TypeScript
├── .env.local.example        # Ejemplo de variables de entorno
├── next.config.js            # Configuración de Next.js
├── package.json              # Dependencias del proyecto
├── tailwind.config.ts        # Configuración de Tailwind CSS
└── tsconfig.json             # Configuración de TypeScript
```

## 🎨 Características de la interfaz

- **Header**: Logo, título, selector de modelos y botón para limpiar el chat
- **Selector de modelos**: Dropdown para cambiar entre los modelos de Ollama instalados
- **Lista de mensajes**: Muestra la conversación con scroll automático
- **Input de chat**: Campo de texto con soporte para múltiples líneas (Shift + Enter)
- **Burbujas de mensaje**: Diseño diferenciado para usuario y asistente
- **Indicador de carga**: Animación mientras se espera la respuesta
- **Renderizado Markdown**: Las respuestas del asistente soportan formato Markdown

## 🔧 Personalización

### Cambiar el modelo predeterminado

Edita [components/ChatInterface.tsx](components/ChatInterface.tsx#L11) y cambia el modelo inicial:

```typescript
const [selectedModel, setSelectedModel] = useState("mistral"); // o "llama2", "codellama", etc.
```

### Configurar URL personalizada de Ollama

Si Ollama está ejecutándose en otra máquina o puerto, crea `.env.local`:

```bash
OLLAMA_API_URL=http://tu-servidor:11434
```

### Modelos disponibles

Algunos modelos populares de Ollama:
- `llama2` - Meta Llama 2 (7B)
- `llama3` - Meta Llama 3 (8B)
- `mistral` - Mistral 7B
- `codellama` - Code Llama (código)
- `phi` - Microsoft Phi-2 (2.7B)
- `gemma` - Google Gemma (2B/7B)

Consulta más modelos en: https://ollama.ai/library

## � Despliegue en Servidor Linux

### Requisitos del servidor

- Ubuntu 20.04+ / Debian 11+ / CentOS 8+ o similar
- Mínimo 4GB RAM (8GB+ recomendado para modelos grandes)
- Node.js 18+
- PM2 para gestión de procesos
- Nginx (opcional, para reverse proxy)

### Paso 1: Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Paso 2: Instalar Node.js 18+

```bash
# Instalar Node.js usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Paso 3: Instalar Ollama

```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verificar instalación
ollama --version

# Descargar un modelo
ollama pull llama3.3
# o cualquier otro modelo que prefieras
```

### Paso 4: Configurar Ollama como servicio

Ollama se instala automáticamente como servicio systemd. Verifica su estado:

```bash
sudo systemctl status ollama

# Si no está activo, iniciarlo
sudo systemctl start ollama
sudo systemctl enable ollama
```

### Paso 5: Clonar el proyecto

```bash
# Navegar al directorio deseado
cd /var/www

# Clonar el repositorio (o subir archivos via SCP/SFTP)
git clone https://github.com/tu-usuario/uiollama.git
cd uiollama

# O si subes archivos manualmente:
# scp -r ./uiollama usuario@servidor:/var/www/
```

### Paso 6: Instalar dependencias y construir

```bash
# Instalar dependencias
npm install

# Construir para producción
npm run build
```

### Paso 7: Configurar variables de entorno (opcional)

```bash
# Si necesitas personalizar la URL de Ollama
nano .env.local

# Agregar:
# OLLAMA_API_URL=http://localhost:11434

# Guardar con Ctrl+X, luego Y, luego Enter
```

### Paso 8: Instalar PM2 para gestión de procesos

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start npm --name "uiollama" -- start

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
pm2 save

# Verificar estado
pm2 status
pm2 logs uiollama
```

### Paso 9: Configurar Firewall

```bash
# Permitir tráfico en el puerto 3000
sudo ufw allow 3000/tcp

# O si usas Nginx (paso siguiente), solo permite 80 y 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Paso 10: Configurar Nginx como Reverse Proxy (Recomendado)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/uiollama

# Agregar esta configuración:
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # Cambiar por tu dominio o IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/uiollama /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Paso 11: Configurar SSL con Let's Encrypt (Opcional pero recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática (Certbot la configura automáticamente)
sudo certbot renew --dry-run
```

### Comandos útiles para gestión

```bash
# Ver logs de la aplicación
pm2 logs uiollama

# Reiniciar aplicación
pm2 restart uiollama

# Detener aplicación
pm2 stop uiollama

# Ver estado de Ollama
sudo systemctl status ollama

# Ver modelos instalados
ollama list

# Reiniciar Nginx
sudo systemctl restart nginx

# Monitorear recursos
pm2 monit
htop
```


# Instalación rápida con script
```bash
git clone https://github.com/falconsoft3d/uiollama.git
cd uiollama
chmod +x install.sh
./install.sh
```bash


### Actualizar la aplicación

```bash
cd /var/www/uiollama

# Detener la aplicación
pm2 stop uiollama

# Actualizar código
git pull origin main
# o subir nuevos archivos

# Instalar nuevas dependencias (si las hay)
npm install

# Reconstruir
npm run build

# Reiniciar
pm2 restart uiollama
```

### Solución de problemas

**Problema: La aplicación no se conecta a Ollama**
```bash
# Verificar que Ollama esté corriendo
sudo systemctl status ollama

# Ver logs de Ollama
sudo journalctl -u ollama -f
```

**Problema: Error de memoria al usar modelos grandes**
```bash
# Aumentar memoria swap si es necesario
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Problema: PM2 no se inicia al arrancar**
```bash
# Reconfigurar PM2 startup
pm2 unstartup
pm2 startup
pm2 save
```

## �📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en este repositorio.

# Instrucciones para Dockerizar NetRunner

## Requisitos Previos
- Docker instalado
- Docker Compose instalado

## Estructura de Archivos Creados

```
NetRunner/
├── docker-compose.yml           # Configuración de todos los servicios
├── backend/
│   ├── Dockerfile              # Imagen de Node.js para el backend
│   ├── .dockerignore           # Archivos a ignorar en el build
│   └── .env.docker             # Variables de entorno para Docker
└── frontend/
    ├── Dockerfile              # Imagen optimizada de Next.js
    ├── .dockerignore           # Archivos a ignorar en el build
    └── next.config.ts          # Configuración con output: 'standalone'
```

## Servicios Incluidos

El `docker-compose.yml` ahora incluye:

1. **postgres** - Base de datos PostgreSQL (puerto 5432)
2. **pgadmin** - Interfaz gráfica para PostgreSQL (puerto 8080)
3. **ollama** - Servidor de IA Ollama (puerto 11434)
4. **ollama-pull** - Script de setup automático de modelos
5. **backend** - API Node.js/Express (puerto 3001) ✨ NUEVO
6. **frontend** - Aplicación Next.js (puerto 3000) ✨ NUEVO

## Comandos para Usar Docker

### 1. Construir e Iniciar Todo

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes del backend y frontend
- Inicia todos los servicios (postgres, pgadmin, ollama, backend, frontend)
- Descarga y configura los modelos de IA automáticamente

### 2. Iniciar en Segundo Plano (Modo Detached)

```bash
docker-compose up -d
```

### 3. Ver Logs de los Servicios

```bash
# Ver todos los logs
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ver solo logs del frontend
docker-compose logs -f frontend
```

### 4. Detener Todos los Servicios

```bash
docker-compose down
```

### 5. Detener y Eliminar Volúmenes (Borrar Datos)

```bash
docker-compose down -v
```

⚠️ **ADVERTENCIA**: Esto eliminará todos los datos de la base de datos y modelos de IA descargados.

### 6. Reconstruir un Servicio Específico

```bash
# Reconstruir solo el backend
docker-compose up --build backend

# Reconstruir solo el frontend
docker-compose up --build frontend
```

### 7. Ejecutar Comandos Dentro de un Contenedor

```bash
# Entrar al contenedor del backend
docker exec -it netrunner_backend sh

# Ejecutar migraciones de Prisma manualmente
docker exec -it netrunner_backend npx prisma migrate deploy

# Entrar al contenedor del frontend
docker exec -it netrunner_frontend sh
```

## URLs de Acceso

Una vez que todos los servicios estén corriendo:

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (API)**: http://localhost:3001
- **PgAdmin (DB Manager)**: http://localhost:8080
  - Email: admin@dev.com
  - Password: InsecurePasswd
- **Ollama (IA)**: http://localhost:11434

## Solución de Problemas

### El backend no se conecta a la base de datos

1. Verifica que postgres esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Revisa los logs del backend:
   ```bash
   docker-compose logs backend
   ```

3. Asegúrate de que las migraciones se ejecutaron:
   ```bash
   docker exec -it netrunner_backend npx prisma migrate deploy
   ```

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Revisa los logs:
   ```bash
   docker-compose logs frontend
   docker-compose logs backend
   ```

### Reconstruir desde cero

Si algo sale mal, puedes reiniciar todo desde cero:

```bash
# Detener y eliminar todo (excepto volúmenes)
docker-compose down

# Eliminar imágenes construidas
docker-compose rm -f

# Reconstruir e iniciar
docker-compose up --build
```

## Modo Desarrollo vs Producción

### Desarrollo (con Hot Reload)

El `docker-compose.yml` actual está configurado para desarrollo con volúmenes montados que permiten ver cambios en tiempo real.

### Producción

Para producción, comenta las líneas de volúmenes en `docker-compose.yml`:

```yaml
backend:
  # volumes:
  #   - ./backend:/app
  #   - /app/node_modules
```

Luego reconstruye:
```bash
docker-compose up --build -d
```

## Notas Importantes

1. **Primera Ejecución**: La primera vez que ejecutes `docker-compose up`, tomará tiempo porque:
   - Se construyen las imágenes del backend y frontend
   - Se descargan los modelos de IA (dolphin-llama3)
   - Se ejecutan las migraciones de la base de datos

2. **Persistencia de Datos**: Los datos de PostgreSQL y los modelos de Ollama se guardan en volúmenes de Docker, por lo que sobrevivirán a reinicios.

3. **Variables de Entorno**: El backend usa `.env.docker` cuando corre en Docker, que tiene URLs internas del contenedor (postgres, ollama) en lugar de localhost.

4. **CORS**: El backend está configurado para aceptar peticiones desde el frontend tanto en desarrollo (localhost:3000) como en Docker (frontend:3000).

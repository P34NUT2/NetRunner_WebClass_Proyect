# Docker Instructions - NetRunner AI

## 🚀 Quick Start (Default Configuration)

The project comes **pre-configured with the `netrunner-tiny` model** for fastest performance.

```bash
# 1. Start all services
docker compose up -d

# 2. Wait for model download (first time only)
# This will automatically download dolphin-llama3 and create the netrunner model

# 3. Open browser
http://localhost:3000
```

That's it! The application will be ready in a few minutes.

---

## 🔧 Changing the AI Model

The project includes **5 different prompt configurations** (Modelfiles) with varying levels of context and detail:

| Model File | Size | Context Window | Best For |
|------------|------|----------------|----------|
| `netrunner-tiny` ⚡ | 435 B | 256 tokens | Fastest responses, minimal context **(DEFAULT)** |
| `netrunner-minimal` | 1.1 KB | 512 tokens | Quick responses with basic context |
| `netrunner-light` | 5.1 KB | 2048 tokens | Essential CTF techniques |
| `netrunner-medium` | 3.2 KB | 4096 tokens | Balanced speed and knowledge |
| `netrunner-model-personalizado` | 31 KB | 8192 tokens | Full prompt library with all techniques |

### How to Change the Model

Edit the `docker-compose.yml` file in **2 places**:

#### 1. Line 55 - Mount the Modelfile

Change this line to use your preferred model:
```yaml
volumes:
  - ./netrunner-tiny:/netrunner-tiny:ro
```

To:
```yaml
volumes:
  - ./netrunner-minimal:/netrunner-minimal:ro
```

Or any other model file.

#### 2. Line 89 - Create command

Change the model file path:
```yaml
docker exec netrunner_ollama ollama create netrunner -f /netrunner-tiny;
```

To:
```yaml
docker exec netrunner_ollama ollama create netrunner -f /netrunner-minimal;
```

### Example: Switching to Full Custom Model

**Before (docker-compose.yml):**
```yaml
# Line 55
- ./netrunner-tiny:/netrunner-tiny:ro

# Line 89
docker exec netrunner_ollama ollama create netrunner -f /netrunner-tiny;
```

**After (docker-compose.yml):**
```yaml
# Line 55
- ./netrunner-model-personalizado:/netrunner-model-personalizado:ro

# Line 89
docker exec netrunner_ollama ollama create netrunner -f /netrunner-model-personalizado;
```

### Apply the Changes

After editing `docker-compose.yml`:

```bash
# 1. Stop containers
docker compose down

# 2. Remove Ollama volume to force recreation
docker volume rm netrunner_ollama_data

# 3. Start with new model
docker compose up -d
```

---

## 🐳 Docker Services Overview

The application runs **6 services**:

### 1. PostgreSQL
- **Container**: `postgres_db`
- **Port**: 5432
- **Purpose**: Stores users, chats, and messages

### 2. pgAdmin
- **Container**: `pgadmin`
- **Port**: 8080
- **Purpose**: Database management UI
- **Access**: http://localhost:8080
- **Login**: `admin@dev.com` / `InsecurePasswd`

### 3. Ollama
- **Container**: `netrunner_ollama`
- **Port**: 11434
- **Purpose**: AI model runtime
- **API**: http://localhost:11434

### 4. Ollama Model Puller
- **Container**: `ollama_model_puller`
- **Purpose**: Downloads `dolphin-llama3` and creates `netrunner` model
- **Run**: Once on startup, then exits

### 5. Backend
- **Container**: `netrunner_backend`
- **Port**: 3001
- **Purpose**: Express API server
- **API**: http://localhost:3001

### 6. Frontend
- **Container**: `netrunner_frontend`
- **Port**: 3000
- **Purpose**: Next.js web interface
- **Access**: http://localhost:3000

---

## 🛠️ Common Commands

### Start Services
```bash
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f ollama
```

### Rebuild After Code Changes
```bash
docker compose up -d --build
```

### Check Running Containers
```bash
docker ps
```

### Check Ollama Models
```bash
docker exec -it netrunner_ollama ollama list
```

### Recreate a Specific Model
```bash
docker exec -it netrunner_ollama ollama create netrunner -f /netrunner-tiny
```

### Delete a Model
```bash
docker exec -it netrunner_ollama ollama rm netrunner
```

---

## 🗑️ Clean Up

### Remove Everything (Including Data)
```bash
# Stop containers
docker compose down

# Remove volumes (⚠️ deletes all data)
docker volume rm netrunner_postgres_data
docker volume rm netrunner_pgadmin_data
docker volume rm netrunner_ollama_data
```

### Reset Only Ollama Model
```bash
docker compose down
docker volume rm netrunner_ollama_data
docker compose up -d
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using the port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :11434

# Kill the process or change port in docker-compose.yml
```

### Model Not Found
```bash
# Check if model exists
docker exec -it netrunner_ollama ollama list

# Recreate model
docker exec -it netrunner_ollama ollama create netrunner -f /netrunner-tiny
```

### Backend Can't Connect to Database
```bash
# Check if postgres is running
docker ps | grep postgres

# View postgres logs
docker logs postgres_db

# Restart postgres
docker compose restart postgres
```

### Ollama Not Responding
```bash
# Check ollama logs
docker logs netrunner_ollama

# Restart ollama
docker compose restart ollama

# Check ollama health
docker exec -it netrunner_ollama ollama list
```

---

## 📊 Resource Usage

Approximate resource requirements:

| Service | RAM | Disk | Notes |
|---------|-----|------|-------|
| PostgreSQL | ~50 MB | ~200 MB | Database data |
| pgAdmin | ~100 MB | ~100 MB | Web UI |
| Ollama | ~2-4 GB | ~2-4 GB | Depends on model |
| Backend | ~100 MB | ~50 MB | Node.js API |
| Frontend | ~150 MB | ~100 MB | Next.js |
| **Total** | **~2.5-4.5 GB** | **~3-5 GB** | |

### Model Sizes
- `dolphin-llama3`: ~2 GB
- `netrunner-tiny`: Negligible (system prompt)
- `netrunner-model-personalizado`: Negligible (system prompt)

---

## 🔐 Default Credentials (Development)

⚠️ **Change these before deploying to production!**

### PostgreSQL
- **Host**: `postgres` (inside Docker network) or `localhost:5432` (from host)
- **Username**: `webdev`
- **Password**: `InsecurePasswd`
- **Database**: `netrunner`

### pgAdmin
- **URL**: http://localhost:8080
- **Email**: `admin@dev.com`
- **Password**: `InsecurePasswd`

---

## 💡 Tips

### Speed vs Context Trade-off

- **Use `netrunner-tiny`** (default) when:
  - You need fast responses
  - You're asking simple questions
  - Speed is more important than detailed answers

- **Use `netrunner-model-personalizado`** when:
  - You need comprehensive explanations
  - You're solving complex CTF challenges
  - You want all available techniques in context

### Development vs Production

**Development:**
```bash
# Start only infrastructure, run code locally
docker compose up postgres pgadmin ollama -d
cd backend && npm run dev
cd frontend && npm run dev
```

**Production:**
```bash
# Start everything in Docker
docker compose up -d
```

---

## 📝 Environment Variables

### Backend (.env.docker)

```env
DATABASE_URL=postgresql://webdev:InsecurePasswd@postgres:5432/netrunner
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=SuperMegaInsecurepasswd
JWT_EXPIRES_IN=7d
OLLAMA_HOST=http://ollama:11434
NODE_ENV=production
```

### Frontend (docker-compose.yml)

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🌐 Network

All services communicate via `netrunner_network` (bridge network).

**Inside Docker:**
- Backend connects to: `postgres:5432`, `ollama:11434`
- Frontend connects to: `backend:3001`

**From Host:**
- Frontend: `localhost:3000`
- Backend: `localhost:3001`
- PostgreSQL: `localhost:5432`
- pgAdmin: `localhost:8080`
- Ollama: `localhost:11434`

---

## 🔄 Update Process

### When to Update Docker Containers

You need to update when:
- ✅ You modify backend/frontend code
- ✅ You change dependencies (package.json)
- ✅ You update environment variables
- ✅ You modify Docker configuration files
- ✅ You pull changes from git repository

### Quick Update (Code Changes Only)

If you only changed code (no dependencies):

```bash
# Restart specific service
docker compose restart backend
docker compose restart frontend

# Or restart all
docker compose restart
```

### Full Update (Recommended)

When you change dependencies, Dockerfiles, or want a clean rebuild:

```bash
# 1. Stop all containers
docker compose down

# 2. Rebuild images (this incorporates all changes)
docker compose build

# 3. Start containers with new images
docker compose up -d
```

### One-Command Full Update

```bash
# Stop, rebuild, and restart everything
docker compose down && docker compose up -d --build
```

### Updating After Git Pull

```bash
# Pull latest changes
git pull origin main

# Stop containers
docker compose down

# Rebuild with new changes
docker compose up -d --build

# Check logs to verify everything started correctly
docker compose logs -f
```

### Updating Only Backend

```bash
# Stop backend
docker compose stop backend

# Rebuild backend image
docker compose build backend

# Start backend
docker compose up -d backend

# View logs
docker compose logs -f backend
```

### Updating Only Frontend

```bash
# Stop frontend
docker compose stop frontend

# Rebuild frontend image
docker compose build frontend

# Start frontend
docker compose up -d frontend

# View logs
docker compose logs -f frontend
```

### Force Clean Rebuild (Nuclear Option)

Use this when something is broken and normal rebuild doesn't fix it:

```bash
# 1. Stop everything
docker compose down

# 2. Remove all images (forces complete rebuild)
docker compose down --rmi all

# 3. Remove volumes (⚠️ deletes all data - use with caution)
docker volume rm netrunner_postgres_data
docker volume rm netrunner_pgadmin_data
docker volume rm netrunner_ollama_data

# 4. Rebuild from scratch
docker compose up -d --build

# 5. Wait for initial setup (model download, migrations)
docker compose logs -f
```

### Update Checklist

Before updating, make sure:
- [ ] You committed your local changes to git
- [ ] You backed up important data (if needed)
- [ ] You know which services need updating

After updating:
- [ ] Check logs: `docker compose logs -f`
- [ ] Test frontend: http://localhost:3000
- [ ] Test backend API: http://localhost:3001
- [ ] Verify database connection

---

**Default Model**: `netrunner-tiny` ⚡
**Recommended for most users**: `netrunner-minimal` or `netrunner-light`
**For maximum context**: `netrunner-model-personalizado` (slower but more comprehensive)

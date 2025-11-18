# NetRunner AI
An uncensored AI assistant specifically trained with CTF writeups and pentesting techniques to help cybersecurity professionals and CTF participants solve challenges.

<div align="left">
  <img height="300" src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGV0M3pobTlmM2JtazRzMndneXdkOWp1YjhkYjBqdzZsMGZqaDFjeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdYt5HYinIx13ji/giphy.gif"  />
</div>

## 🎯 Overview

NetRunner AI is an intelligent assistant specialized in **Capture The Flag (CTF)** competitions and **ethical pentesting**. Built with real techniques and experiences from actual cybersecurity challenges, it provides expert guidance for reconnaissance, exploitation, and privilege escalation.

**Version:** 1.0 - Modelo Personalizado
**Last Updated:** November 18, 2025
**Status:** Fully functional and dockerized

### Key Features
- ✅ Custom AI model `netrunner` based on dolphin-llama3
- ✅ Knowledge of ethical hacking techniques (XSS, SQLi, SSTI, SSRF, etc.)
- ✅ Real CTF writeups (HackTheBox, Sunshine CTF)
- ✅ Dual mode: Authenticated (PostgreSQL) + Guest (localStorage)
- ✅ Modern web interface with Next.js + TailwindCSS
- ✅ 100% local - your data never leaves your machine
- ✅ Fully dockerized infrastructure

---

## 🚀 Quick Start

```bash
# 1. Start Docker services
cd /home/antonio/proyectos/NetRunner
docker compose up -d

# 2. Backend starts automatically in Docker
# Frontend starts automatically in Docker

# 3. Open browser
http://localhost:3000
```

**That's it!** The model will be automatically downloaded and created on first run.

For detailed instructions, see: [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt)

---

## 📁 Project Structure

```
NetRunner/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Main chat interface
│   │   ├── login/page.tsx        # Authentication page
│   │   ├── register/page.tsx     # User registration
│   │   └── profile/page.tsx      # User profile
│   ├── components/
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Sidebar.tsx           # Chat history sidebar
│   │   ├── MessageBox.tsx        # Message display
│   │   ├── InputArea.tsx         # Chat input
│   │   └── InfoModal.tsx         # Settings modal
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── ChatContext.tsx       # Chat management
│   ├── Dockerfile
│   └── next.config.ts
├── backend/
│   ├── controllers/
│   │   ├── Auth_And_Registration.js
│   │   └── ChatController.js
│   ├── routes/
│   │   ├── authRouts.js
│   │   └── chatRoutes.js
│   ├── services/
│   │   └── ollamaService.js      # Ollama integration
│   ├── middlewares/
│   │   └── verifyToken.js        # JWT verification
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/
│   ├── config/
│   │   └── prisma.js
│   ├── Dockerfile
│   └── index.js
├── netrunner-tiny                 # Tiny model (CURRENTLY ACTIVE)
├── netrunner-minimal              # Minimal model
├── netrunner-light                # Light model
├── netrunner-medium               # Medium model
├── netrunner-model-personalizado  # Full custom model
├── docker-compose.yml             # Docker orchestration
└── README.md
```

---

## 🛠️ Tech Stack

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" height="40" alt="nextjs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="40" alt="postgresql logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="40" alt="docker logo"  />
</div>

### Frontend
- **Next.js 16** - React framework with SSR
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS
- **Context API** - Global state management
- **react-icons** - Icon library

### Backend
- **Node.js 20** - JavaScript runtime
- **Express 5** - Web framework
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Database
- **PostgreSQL 15** - Relational database
- **pgAdmin 4** - Database management UI

### AI & Machine Learning
- **Ollama** - Local LLM runtime
- **dolphin-llama3** - Base uncensored model
- **Custom Modelfiles** - Specialized CTF knowledge

### Infrastructure
- **Docker Compose** - Multi-container orchestration
- **6 services**: postgres, pgAdmin, ollama, ollama-pull, backend, frontend
- **Persistent volumes** for data retention

---

## 🧠 Included Techniques

The `netrunner` model includes knowledge of:

### Web Exploitation
- **XSS** (Cross-Site Scripting) - fetch(), cookies, DOM manipulation
- **SQL Injection** - UNION, blind, time-based, enumeración
- **CSRF** - Token bypass, SameSite=Lax exploitation
- **SSTI** (Server-Side Template Injection) - Handlebars, Jinja2
- **SSRF** (Server-Side Request Forgery) - localhost bypass
- **IDOR** (Insecure Direct Object Reference)
- **DNS Rebinding** - Race conditions, dual responses

### Privilege Escalation
- **Linux**: SUID binaries, PATH hijacking, capabilities, sudo misconfigurations
- **Windows**: PsExec, WinPEAS, token impersonation

### Reverse Shells
- **Linux**: bash, nc, Python, PHP webshells
- **Windows**: nc64.exe, PowerShell, msfvenom
- **Tunneling**: SSH port forwarding, ProxyChains, pinggy, ngrok

### Tools & Utilities
- **Reconnaissance**: Nmap, rustscan, ffuf, gobuster
- **Web**: Burp Suite, SQLMap, wfuzz
- **Password Cracking**: John The Ripper, Hashcat
- **Network Analysis**: Wireshark, tcpdump
- **Frameworks**: Metasploit, BeEF

---

## 🏆 CTF Writeups Included

The model has been trained with real writeups:

1. **Cap (HackTheBox)**
   - Technique: IDOR + Linux capabilities
   - Path: Enumeration → Wireshark PCAP analysis → Privesc with setuid

2. **WebHook (Sunshine CTF 2025)**
   - Technique: DNS Rebinding + SSRF bypass
   - Path: Reconnaissance → localhost filter bypass → Flag extraction

---

## 🌐 Ports & Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Next.js web interface |
| Backend | 3001 | http://localhost:3001 | Express API server |
| PostgreSQL | 5432 | localhost:5432 | Database (internal) |
| pgAdmin | 8080 | http://localhost:8080 | Database UI |
| Ollama | 11434 | http://localhost:11434 | AI model API |

### Default Credentials (Development Only)

**PostgreSQL:**
- Username: `webdev`
- Password: `InsecurePasswd`
- Database: `netrunner`

**pgAdmin:**
- Email: `admin@dev.com`
- Password: `InsecurePasswd`

> ⚠️ **Warning**: Change these credentials before deploying to production!

---

## 🎨 Features

### Authentication & Users
- ✅ User registration with validation
- ✅ JWT-based login (7-day expiration)
- ✅ User profile management (editable real name)
- ✅ Session persistence (localStorage)
- ✅ Guest mode (no authentication required)

### Chat & Messaging
- ✅ Multiple independent chats
- ✅ Automatic chat creation on login
- ✅ Real-time messages with Ollama
- ✅ "Typing..." indicator
- ✅ Auto-generated chat titles (first 47 characters)
- ✅ Persistent storage (PostgreSQL + localStorage)

### Chat Management
- ✅ Sidebar with chat history
- ✅ Create new chat
- ✅ Switch between chats
- ✅ Delete individual chat
- ✅ Delete all chats
- ✅ Relative timestamps ("2 hours ago", "Yesterday")
- ✅ Message counter per chat
- ✅ Active chat highlighting

### UI/UX
- ✅ Dark mode theme (Black + Red + Gray)
- ✅ Smooth animations (hover, active, pulse)
- ✅ Responsive design
- ✅ Modern minimalist interface

---

## 🔐 Architecture

### Authentication Flow
```
User → Frontend → Backend → JWT Verification → PostgreSQL
```

### Chat Flow (Authenticated)
```
User Input → ChatContext → Backend API → PostgreSQL (save)
          ↓
      Ollama Service → Model Inference → Response
          ↓
      PostgreSQL (save) → Backend → Frontend → UI Update
```

### Chat Flow (Guest Mode)
```
User Input → ChatContext → localStorage (save)
          ↓
      Direct Ollama Call (port 11434) → Response
          ↓
      localStorage (save) → UI Update
```

---

## 🐳 Docker Services

The application runs 6 Docker containers:

1. **postgres** - PostgreSQL 15 database
2. **pgadmin** - Database management interface
3. **ollama** - AI model runtime
4. **ollama-pull** - Auto-downloads models on first run
5. **backend** - Node.js API server
6. **frontend** - Next.js web application

All services are connected via `netrunner_network` bridge network.

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt) | Complete startup guide |
| [SESION_ACTUAL_11NOV2025.txt](SESION_ACTUAL_11NOV2025.txt) | Current status and next steps |
| [ESTADO_ACTUAL_PROYECTO.txt](ESTADO_ACTUAL_PROYECTO.txt) | Full project state |
| [EXPLICACION_TOKENS_Y_CONTEXTO.md](EXPLICACION_TOKENS_Y_CONTEXTO.md) | How context works |
| [COMO_FUNCIONA_LA_CONEXION.txt](COMO_FUNCIONA_LA_CONEXION.txt) | Technical architecture |

---

## 🛠️ Development

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- npm or yarn

### Local Development (Without Docker)

```bash
# 1. Start PostgreSQL (Docker)
docker compose up postgres -d

# 2. Start Ollama (Docker)
docker compose up ollama ollama-pull -d

# 3. Install backend dependencies
cd backend
npm install

# 4. Run database migrations
npx prisma migrate dev

# 5. Start backend
npm run dev

# 6. Install frontend dependencies (new terminal)
cd frontend
npm install

# 7. Start frontend
npm run dev
```

### Production (Docker)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild after changes
docker compose up -d --build
```

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (requires JWT)
- `PUT /api/auth/profile` - Update real name (requires JWT)

### Chat
- `GET /api/chat` - Get all user chats (requires JWT)
- `POST /api/chat` - Create new chat (requires JWT)
- `GET /api/chat/:id/messages` - Get chat messages (requires JWT)
- `POST /api/chat/:id/messages` - Send message and get AI response (requires JWT)
- `DELETE /api/chat/:id` - Delete specific chat (requires JWT)
- `DELETE /api/chat/all` - Delete all user chats (requires JWT)

---

## 🔧 Available Models

The project includes multiple model configurations:

| Model | Size | Context | Use Case | Status |
|-------|------|---------|----------|--------|
| **netrunner-tiny** | 435 B | 256 tokens | Fastest, minimal context | ✅ **ACTIVE** |
| netrunner-minimal | 1.1 KB | 512 tokens | Quick responses | Available |
| netrunner-light | 5.1 KB | 2048 tokens | Essential techniques | Available |
| netrunner-medium | 3.2 KB | 4096 tokens | Balanced | Available |
| netrunner-custom | 31 KB | 8192 tokens | Full knowledge base | Available |

To change the model, edit `docker-compose.yml` lines 55 and 89.

---

## 🐛 Troubleshooting

### Model not found
```bash
# Check if model exists
docker exec -it netrunner_ollama ollama list

# Recreate model
docker exec -it netrunner_ollama ollama create netrunner -f /netrunner-tiny
```

### Database connection failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker logs postgres_db
```

### Port already in use
```bash
# Check which process is using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill the process or change the port in docker-compose.yml
```

For more issues, see: [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt) → Section "Problemas Comunes"

---

## 👤 Author

**José Antonio Villafaña Montes de Oca**

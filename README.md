# NetRunner AI - Asistente de CTF y Pentesting

**Versión:** 1.0 - Modelo Personalizado
**Última actualización:** 11 de Noviembre de 2025

## 🎯 ¿Qué es NetRunner AI?

NetRunner AI es un asistente de inteligencia artificial especializado en Capture The Flag (CTF) y pentesting, entrenado con técnicas reales y experiencias de challenges de ciberseguridad.

### Características principales:
- ✅ Modelo personalizado `netrunner-custom` basado en llama3.2
- ✅ Conocimiento de técnicas de hacking ético (XSS, SQLi, SSTI, etc.)
- ✅ Writeups de CTF reales (HackTheBox, Sunshine CTF)
- ✅ Modo dual: Autenticado (PostgreSQL) + Invitado (localStorage)
- ✅ Interfaz web moderna con Next.js + TailwindCSS
- ✅ 100% local - tus datos nunca salen de tu máquina

---

## 🚀 Inicio Rápido

```bash
# 1. Iniciar Docker
cd /home/antonio/proyectos/NetRunner
docker compose up -d

# 2. Crear modelo personalizado (solo primera vez)
docker cp netrunner-model-personalizado netrunner_ollama:/netrunner-model-personalizado
docker exec -it netrunner_ollama ollama create netrunner-custom -f /netrunner-model-personalizado

# 3. Iniciar Backend (Terminal 1)
cd backend && npm start

# 4. Iniciar Frontend (Terminal 2)
cd frontend && npm run dev

# 5. Abrir navegador
http://localhost:3000
```

**Para más detalles, lee:** [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt)

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt) | ⭐ Guía completa de inicio |
| [SESION_ACTUAL_11NOV2025.txt](SESION_ACTUAL_11NOV2025.txt) | Estado actual y próximos pasos |
| [ESTADO_ACTUAL_PROYECTO.txt](ESTADO_ACTUAL_PROYECTO.txt) | Estado completo del proyecto |
| [EXPLICACION_TOKENS_Y_CONTEXTO.md](EXPLICACION_TOKENS_Y_CONTEXTO.md) | Cómo funciona el contexto |
| [COMO_FUNCIONA_LA_CONEXION.txt](COMO_FUNCIONA_LA_CONEXION.txt) | Arquitectura técnica |

---

## 🧠 Técnicas Incluidas en el Modelo

El modelo `netrunner-custom` incluye conocimiento de:

### Web Exploitation
- XSS (Cross-Site Scripting) con fetch(), cookies
- SQL Injection (UNION, blind, enumeración)
- CSRF (bypass de SameSite=Lax)
- SSTI (Server-Side Template Injection)
- SSRF (Server-Side Request Forgery)
- IDOR (Insecure Direct Object Reference)
- DNS Rebinding

### Privilege Escalation
- Linux: SUID + PATH, capabilities
- Windows: PsExec, WinPEAS

### Reverse Shells
- Linux bash, PHP webshells
- Windows nc64.exe, PowerShell
- Tunneling (SSH, ProxyChains, pinggy)

### Tools & Utilities
- Nmap, Burp Suite, SQLMap
- John The Ripper, Hashcat
- Wireshark, tcpdump

---

## 🏆 CTF Writeups Incluidos

- **Cap (HackTheBox):** IDOR + Linux capabilities
- **WebHook (Sunshine CTF 2025):** DNS Rebinding + SSRF bypass

---

## 🔧 Stack Tecnológico

**Frontend:**
- Next.js 16 + React 19 + TypeScript
- TailwindCSS 4
- Context API para estado global

**Backend:**
- Node.js + Express 5
- Prisma ORM
- JWT para autenticación

**Base de Datos:**
- PostgreSQL 15

**IA:**
- Ollama (llama3.2)
- Modelo personalizado: netrunner-custom

**Infraestructura:**
- Docker Compose
- 3 contenedores: PostgreSQL, pgAdmin, Ollama

---

## 🌐 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |
| pgAdmin | 5050 | http://localhost:5050 |
| Ollama | 11434 | http://localhost:11434 |

---

## ⚠️ Importante

Este proyecto es para **fines educativos** y debe usarse SOLO en:
- Competencias CTF
- Labs autorizados (HackTheBox, TryHackMe)
- Pentesting con autorización escrita
- Entornos de práctica controlados

---

## 📞 Soporte

Si tienes problemas al iniciar, consulta:
- [COMO_INICIAR_NETRUNNER.txt](COMO_INICIAR_NETRUNNER.txt) → Sección "Problemas Comunes"

---

**Desarrollado por:** Antonio Villafaña
**Modelo entrenado con:** Técnicas personales + Writeups de CTF reales

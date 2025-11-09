# 🧪 GUÍA DE EXPERIMENTACIÓN CON OLLAMA

Esta guía te ayudará a experimentar con Ollama y llama3.2 antes de integrarlo completamente con Docker.

---

## 📋 PREREQUISITO: Ollama debe estar corriendo

```bash
# Verificar que el contenedor de Ollama esté corriendo
docker compose ps ollama

# Si no está corriendo, iniciarlo
docker compose up -d ollama
```

---

## 1️⃣ DESCARGAR EL MODELO LLAMA 3.2

```bash
# Descargar llama3.2 (~2GB, toma 5-15 minutos)
docker exec -it netrunner_ollama ollama pull llama3.2

# Ver progreso:
# pulling manifest
# pulling ff82381e2bea... 100% ▕████████████▏ 1.7 GB
# ...
# success
```

**¿Qué es llama3.2?**
- Modelo de lenguaje de Meta (Facebook)
- Versión 3.2 es más pequeña y rápida
- ~2GB de tamaño
- Bueno para tareas generales

---

## 2️⃣ PROBAR EL MODELO MANUALMENTE (Chat Interactivo)

```bash
# Entrar al chat interactivo con llama3.2
docker exec -it netrunner_ollama ollama run llama3.2
```

**Ahora puedes chatear con la IA:**
```
>>> Hola, ¿cómo estás?
[La IA responde]

>>> ¿Qué es SQL Injection?
[La IA responde]

>>> /bye
[Salir del chat]
```

**Comandos útiles dentro del chat:**
- `/bye` - Salir del chat
- `/clear` - Limpiar la conversación
- `/help` - Ver ayuda
- `Ctrl+D` - También sale

---

## 3️⃣ HACER UNA PREGUNTA ÚNICA (Sin entrar al chat)

```bash
# Hacer una pregunta directa sin abrir chat interactivo
docker exec -it netrunner_ollama ollama run llama3.2 "¿Qué es un buffer overflow?"
```

**Esto es útil para:**
- Probar respuestas rápidas
- Automatizar preguntas
- Ver cómo responde sin contexto previo

---

## 4️⃣ LISTAR MODELOS DESCARGADOS

```bash
# Ver qué modelos tienes instalados
docker exec -it netrunner_ollama ollama list
```

**Output esperado:**
```
NAME              ID            SIZE      MODIFIED
llama3.2:latest   a80c4f17acd5  2.0 GB    2 minutes ago
```

---

## 5️⃣ CREAR TU MODELO PERSONALIZADO (NetRunner)

### **Paso 1: Ver el Modelfile**

El archivo `netrunner-model` ya existe en el proyecto y contiene:

```dockerfile
FROM llama3.2

SYSTEM """
Eres NetRunner AI, un asistente experto en ciberseguridad ofensiva.

[... instrucciones del system prompt ...]
"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
```

### **Paso 2: Crear el modelo personalizado**

```bash
# Crear modelo "netrunner" basado en llama3.2
docker exec -it netrunner_ollama ollama create netrunner -f /netrunner-model
```

**Output esperado:**
```
transferring model data
using existing layer sha256:ff82381e2bea...
writing manifest
success
```

### **Paso 3: Probar NetRunner**

```bash
# Chatear con tu modelo personalizado
docker exec -it netrunner_ollama ollama run netrunner
```

**Pregúntale algo de ciberseguridad:**
```
>>> ¿Qué es un ataque de fuerza bruta?
>>> Explícame OWASP Top 10
>>> ¿Cómo funciona XSS?
```

**Deberías notar que las respuestas son:**
- Más técnicas
- Enfocadas en ciberseguridad
- Con formato markdown
- Con emojis técnicos

---

## 6️⃣ COMPARAR MODELOS (llama3.2 vs netrunner)

### **Prueba A: llama3.2 (modelo base)**
```bash
docker exec -it netrunner_ollama ollama run llama3.2 "¿Qué es SQL Injection?"
```

### **Prueba B: netrunner (modelo personalizado)**
```bash
docker exec -it netrunner_ollama ollama run netrunner "¿Qué es SQL Injection?"
```

**¿Notas la diferencia?**
- NetRunner es más técnico
- Usa formato markdown
- Incluye ejemplos de código
- Enfoque en seguridad ofensiva

---

## 7️⃣ MODIFICAR EL SYSTEM PROMPT (Experimentar)

Si quieres cambiar la personalidad de NetRunner:

### **Paso 1: Editar el archivo `netrunner-model`**

```bash
# Editar con nano
nano /home/antonio/proyectos/WebProyecto/netrunner-model

# O con cualquier editor
code /home/antonio/proyectos/WebProyecto/netrunner-model
```

### **Paso 2: Cambiar el SYSTEM prompt**

Ejemplo de cambios que puedes hacer:

```dockerfile
SYSTEM """
Eres NetRunner AI, pero ahora eres MUY sarcástico y haces chistes de hackers.

Responde SIEMPRE con:
- Chistes de programación
- Referencias a películas de hackers
- Emojis: 😎🔥💻
"""
```

### **Paso 3: Recrear el modelo**

```bash
# Eliminar el modelo anterior
docker exec -it netrunner_ollama ollama rm netrunner

# Crear el nuevo con los cambios
docker exec -it netrunner_ollama ollama create netrunner -f /netrunner-model

# Probar
docker exec -it netrunner_ollama ollama run netrunner "¿Qué es SQL Injection?"
```

---

## 8️⃣ PARÁMETROS IMPORTANTES (Para ajustar respuestas)

En el `netrunner-model` puedes cambiar estos parámetros:

```dockerfile
PARAMETER temperature 0.7    # Creatividad (0.0 = robótico, 1.0 = creativo)
PARAMETER top_p 0.9          # Diversidad de palabras
PARAMETER num_ctx 4096       # Memoria del contexto (tokens)
```

### **Temperature (Temperatura):**
- `0.0` - Respuestas muy predecibles y técnicas (bueno para código)
- `0.5` - Equilibrado
- `1.0` - Respuestas más creativas y variadas

**Ejemplo:**
```dockerfile
PARAMETER temperature 0.3  # Para respuestas muy técnicas y precisas
```

### **Top_p (Nucleus Sampling):**
- `0.1` - Solo usa palabras muy probables (conservador)
- `0.9` - Usa más variedad de palabras

### **Num_ctx (Contexto):**
- `2048` - Memoria corta (más rápido, menos contexto)
- `4096` - Memoria media (default)
- `8192` - Memoria larga (más lento, más contexto)

---

## 9️⃣ EXPERIMENTOS SUGERIDOS

### **Experimento 1: Respuestas Técnicas vs Creativas**

```bash
# Crear versión técnica (temperature 0.1)
echo 'FROM llama3.2
SYSTEM "Responde de forma MUY técnica y precisa"
PARAMETER temperature 0.1' | docker exec -i netrunner_ollama ollama create netrunner-tecnico -f -

# Crear versión creativa (temperature 1.0)
echo 'FROM llama3.2
SYSTEM "Responde de forma creativa con analogías"
PARAMETER temperature 1.0' | docker exec -i netrunner_ollama ollama create netrunner-creativo -f -
```

**Prueba la misma pregunta en ambos:**
```bash
docker exec -it netrunner_ollama ollama run netrunner-tecnico "Explica qué es un hash"
docker exec -it netrunner_ollama ollama run netrunner-creativo "Explica qué es un hash"
```

### **Experimento 2: Diferentes Personalidades**

Crea diferentes versiones del system prompt:

```dockerfile
# netrunner-profesor: Explica como profesor universitario
# netrunner-hacker: Estilo underground, jerga hacker
# netrunner-noob: Explica a principiantes con analogías simples
```

---

## 🔟 COMANDOS ÚTILES PARA EXPERIMENTAR

```bash
# Listar todos los modelos
docker exec -it netrunner_ollama ollama list

# Ver información de un modelo
docker exec -it netrunner_ollama ollama show llama3.2

# Eliminar un modelo (libera espacio)
docker exec -it netrunner_ollama ollama rm nombre-del-modelo

# Ver logs de Ollama (útil para debug)
docker compose logs ollama -f

# Reiniciar Ollama
docker compose restart ollama

# Ver uso de recursos
docker stats netrunner_ollama
```

---

## 🎯 PROBAR LA API DE OLLAMA (Como lo hará tu backend)

### **Desde tu terminal:**

```bash
# Hacer una petición POST a la API de Ollama
curl http://localhost:11434/api/generate -d '{
  "model": "netrunner",
  "prompt": "¿Qué es XSS?",
  "stream": false
}'
```

**Respuesta esperada:**
```json
{
  "model": "netrunner",
  "created_at": "2025-11-07T10:00:00Z",
  "response": "## 🎯 Cross-Site Scripting (XSS)\n\n**¿Qué es?**\n...",
  "done": true
}
```

### **Desde Node.js (como tu backend):**

```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'netrunner',
    prompt: '¿Qué es SQL Injection?',
    stream: false,
  }),
});

const data = await response.json();
console.log(data.response);
```

---

## 🐛 TROUBLESHOOTING

### **Error: "model not found"**
```bash
# Solución: Descargar el modelo
docker exec -it netrunner_ollama ollama pull llama3.2
```

### **Error: "connection refused"**
```bash
# Verificar que Ollama esté corriendo
docker compose ps ollama

# Reiniciar Ollama
docker compose restart ollama
```

### **Respuestas muy lentas**
- Reduce `num_ctx` a 2048
- Usa un modelo más pequeño
- Verifica recursos con `docker stats`

### **El modelo responde en inglés**
```bash
# Agrega al system prompt:
SYSTEM """
IMPORTANTE: Responde SIEMPRE en español.
"""
```

---

## 📚 RECURSOS ADICIONALES

- **Documentación Ollama**: https://ollama.com/docs
- **Modelfile Syntax**: https://github.com/ollama/ollama/blob/main/docs/modelfile.md
- **Modelos disponibles**: https://ollama.com/library
- **Llama 3.2 Info**: https://ollama.com/library/llama3.2

---

## ✅ CHECKLIST DE EXPERIMENTACIÓN

Antes de conectar con tu backend, verifica:

- [ ] Descargaste llama3.2
- [ ] Probaste chat interactivo con `ollama run llama3.2`
- [ ] Creaste el modelo personalizado `netrunner`
- [ ] Probaste `netrunner` y notas la diferencia vs llama3.2
- [ ] Experimentaste cambiando el system prompt
- [ ] Probaste la API con curl
- [ ] Entiendes los parámetros (temperature, top_p, num_ctx)

---

**¡Listo para experimentar! 🚀**

Cualquier duda, revisa los logs:
```bash
docker compose logs ollama -f
```

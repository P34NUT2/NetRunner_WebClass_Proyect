# Etapa 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Etapa 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copia dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build de Next.js (se genera en .next/)
RUN npm run build

# Etapa 3: Runner (imagen final optimizada)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crea usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia archivos necesarios desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambia permisos
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expone el puerto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Inicia Next.js
CMD ["node", "server.js"]

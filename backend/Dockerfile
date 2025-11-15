# Usa una imagen base oficial de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala TODAS las dependencias (incluye Prisma en devDependencies)
RUN npm ci

# Copia el resto de los archivos de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Expone el puerto del backend
EXPOSE 3001

# Comando para iniciar la aplicación
# Espera a que la DB esté lista, ejecuta migraciones y luego inicia el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]

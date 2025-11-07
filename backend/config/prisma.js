//Creo este archivo para que pueda llamar a prisma donde sea y no andar cargandolo
// Configuración de Prisma Client
// Este archivo centraliza la instancia de Prisma para reutilizarla en toda la app

const { PrismaClient } = require('../generated/prisma');

// Creamos una única instancia de Prisma
// Esto evita crear múltiples conexiones a la base de datos
const prisma = new PrismaClient();

module.exports = prisma;

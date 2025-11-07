const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const AuthRoutes = require('./routes/authRouts');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: `Servidor funcionando en el puerto ${PORT}`
    });
});

// Rutas de autenticación para usarlas 
app.use('/api/auth', AuthRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


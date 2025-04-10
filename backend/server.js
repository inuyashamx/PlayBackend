const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const userRoutes = require('./src/routes/userRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-service')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/achievements', achievementRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.json({ message: 'API de Servicios de Videojuegos' });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 
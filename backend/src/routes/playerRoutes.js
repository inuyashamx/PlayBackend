const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPlayer,
  getUserPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/', createPlayer);
router.get('/', getUserPlayers);
router.get('/:id', getPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router; 
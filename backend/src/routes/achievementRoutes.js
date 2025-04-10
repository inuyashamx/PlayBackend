const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAchievement,
  getAchievements,
  getAchievementsByGame,
  assignAchievement,
  getPlayerAchievements
} = require('../controllers/achievementController');

// Rutas públicas
router.get('/', getAchievements);
router.get('/game/:game', getAchievementsByGame);

// Rutas protegidas
router.use(protect);
router.post('/', createAchievement);
router.post('/assign', assignAchievement);
router.get('/player/:playerId', getPlayerAchievements);

module.exports = router; 
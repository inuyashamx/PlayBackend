const Achievement = require('../models/Achievement');
const Player = require('../models/Player');
const User = require('../models/User');

// Crear nuevo logro
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear logro', error: error.message });
  }
};

// Obtener todos los logros
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logros', error: error.message });
  }
};

// Obtener logros por juego
exports.getAchievementsByGame = async (req, res) => {
  try {
    const achievements = await Achievement.find({ game: req.params.game });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logros', error: error.message });
  }
};

// Asignar logro a un jugador
exports.assignAchievement = async (req, res) => {
  try {
    const { playerId, achievementId } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({ message: 'Logro no encontrado' });
    }

    // Verificar si el jugador ya tiene el logro
    if (player.achievements.includes(achievementId)) {
      return res.status(400).json({ message: 'El jugador ya tiene este logro' });
    }

    // Agregar logro al jugador
    player.achievements.push(achievementId);
    await player.save();

    // Agregar logro al usuario
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { achievements: achievementId } }
    );

    res.json({ message: 'Logro asignado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar logro', error: error.message });
  }
};

// Obtener logros de un jugador
exports.getPlayerAchievements = async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId)
      .populate('achievements');
    
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.json(player.achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logros del jugador', error: error.message });
  }
}; 
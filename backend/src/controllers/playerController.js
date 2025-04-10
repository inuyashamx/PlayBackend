const Player = require('../models/Player');
const User = require('../models/User');

// Crear nuevo jugador
exports.createPlayer = async (req, res) => {
  try {
    const { name, game } = req.body;
    
    const player = await Player.create({
      name,
      game,
      user: req.user._id
    });

    // Agregar jugador al usuario
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { players: player._id } }
    );

    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear jugador', error: error.message });
  }
};

// Obtener todos los jugadores del usuario
exports.getUserPlayers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('players');
    res.json(user.players);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener jugadores', error: error.message });
  }
};

// Obtener un jugador específico
exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('achievements');
    
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener jugador', error: error.message });
  }
};

// Actualizar jugador
exports.updatePlayer = async (req, res) => {
  try {
    const { name, game, level, experience, stats, rank } = req.body;
    
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    // Actualizar campos
    if (name) player.name = name;
    if (game) player.game = game;
    if (level) player.level = level;
    if (experience) player.experience = experience;
    if (stats) player.stats = { ...player.stats, ...stats };
    if (rank) player.rank = rank;

    player.lastPlayed = Date.now();
    await player.save();

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar jugador', error: error.message });
  }
};

// Eliminar jugador
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    // Eliminar jugador de la lista del usuario
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { players: player._id } }
    );

    await player.remove();
    res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar jugador', error: error.message });
  }
}; 
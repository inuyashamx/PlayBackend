const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Combat', 'Exploration', 'Collection', 'Social', 'Special'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  icon: {
    type: String,
    default: 'default-achievement.png'
  },
  requirements: {
    type: Map,
    of: Number,
    default: {}
  },
  rarity: {
    type: String,
    enum: ['Común', 'Poco común', 'Raro', 'Épico', 'Legendario'],
    default: 'Común'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement; 
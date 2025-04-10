const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId && !this.facebookId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String
    },
    players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }],
    achievements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }],
    rankings: [{
      game: String,
      score: Number,
      rank: Number
    }],
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para generar token JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
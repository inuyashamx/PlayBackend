const express = require('express');
const router = express.Router();
const { passport, generateToken } = require('../config/passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Ruta para verificar token
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar token' });
  }
});

// Rutas de Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Rutas de Facebook
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Ruta para login con Google token
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
        password: Math.random().toString(36).slice(-8),
      });
    }

    const authToken = generateToken(user);
    res.json({ token: authToken, user });
  } catch (error) {
    res.status(401).json({ message: 'Error al autenticar con Google' });
  }
});

// Ruta para login con Facebook token
router.post('/facebook', async (req, res) => {
  try {
    const { token } = req.body;
    const response = await axios.get(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${token}`
    );
    const { id, name, email } = response.data;

    let user = await User.findOne({ facebookId: id });
    if (!user) {
      user = await User.create({
        facebookId: id,
        username: name,
        email,
        password: Math.random().toString(36).slice(-8),
      });
    }

    const authToken = generateToken(user);
    res.json({ token: authToken, user });
  } catch (error) {
    res.status(401).json({ message: 'Error al autenticar con Facebook' });
  }
});

module.exports = router; 
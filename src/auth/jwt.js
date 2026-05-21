// src/auth/jwt.js
const jwt = require('jsonwebtoken');

const generateTokens = (payload) => ({
  accessToken:  jwt.sign(payload, process.env.JWT_SECRET,         { expiresIn: '15m' }),
  refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d'  })
});

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return { valid: true, payload: jwt.verify(token, secret) };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const { valid, payload, error } = verifyToken(token);
  if (!valid) return res.status(401).json({ error });
  req.user = payload;
  next();
};

module.exports = { generateTokens, verifyToken, authMiddleware };

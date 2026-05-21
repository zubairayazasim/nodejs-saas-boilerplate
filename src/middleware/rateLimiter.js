// src/middleware/rateLimiter.js
const redis  = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

const rateLimiter = ({ limit = 100, window = 60 } = {}) =>
  async (req, res, next) => {
    const key     = `rate:${req.ip}`;
    const current = await client.incr(key);
    if (current === 1) await client.expire(key, window);
    res.setHeader('X-RateLimit-Limit',     limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
    if (current > limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };

module.exports = { rateLimiter };

const { createClient } = require('redis')

const redisClient = createClient()

const CACHE_TTL = {
  USERS: 1800,      // 30 minutos - Cambian poco
  TAGS: 1800,       // 30 minutos - Cambian poco
  POST_IMAGES: 1800, // 30 minutos - Son URLs estáticas
  POSTS: 600,       // 10 minutos - Cambian un poco más seguido
  COMMENTS: 120     // 2 minutos - Cambian mucho más seguido
};
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log(' Redis conectado correctamente');
    } catch (error) {
      console.error(' Error al conectar a Redis:', error);
    }
  }
}

module.exports = {
  redisClient,
  connectRedis,
  CACHE_TTL,
};

const { createClient } = require('redis')

const redisClient = createClient()

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
};

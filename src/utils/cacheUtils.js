const { redisClient } = require('../db/config/redisClient');

const invalidatePostCache = async (postId) => {
    try {
        const key = `post:${postId}`;
        await redisClient.del(key);
    } catch (error) {
        console.error(`Error al invalidar caché del post ${postId}:`, error);
    }
};

const invalidateCommentsCache = async () => {
    try {
        await redisClient.del('comments:todos');
    } catch (error) {
        console.error('Error al invalidar caché de comentarios:', error);
    }
};

const invalidatePostCommentsCache = async (postId) => {
    try {
        const key = `comments:post:${postId}`;
        await redisClient.del(key);
    } catch (error) {
        console.error(`Error al invalidar caché de comentarios del post ${postId}:`, error);
    }
};

const invalidatePostsListCache = async () => {
    try {
        await redisClient.del('posts:todos');
    } catch (error) {
        console.error('Error al invalidar caché de lista de posts:', error);
    }
};

// Función para limpiar manualmente el cache de un post específico
const clearPostCache = async (postId) => {
    try {
        const cacheKey = `post:${postId}`;
        await redisClient.del(cacheKey);
        return true;
    } catch (error) {
        console.error(`Error al limpiar cache manualmente para post ${postId}:`, error);
        return false;
    }
};

module.exports = {
    invalidatePostCache,
    invalidateCommentsCache,
    invalidatePostCommentsCache,
    invalidatePostsListCache,
    clearPostCache
}; 
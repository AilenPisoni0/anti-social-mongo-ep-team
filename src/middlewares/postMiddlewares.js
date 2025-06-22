const PostImage = require('../db/models/postImage');
const Comment = require('../db/models/comment');
const Post = require('../db/models/post');
const { invalidatePostCache, invalidateCommentsCache, invalidatePostsListCache } = require('../utils/cacheUtils');
const { redisClient } = require('../db/config/redisClient');

// Middleware para validar que un post existe
const validatePostExists = async (req, res, next) => {
    try {
        const postId = req.params.postId || req.body.postId || req.params.id;

        if (!postId) {
            return res.status(400).json({ error: 'Se requiere el ID del post' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        req.post = post;
        next();
    } catch (err) {
        console.error('Error al validar el post:', err);
        res.status(500).json({ error: 'Error al validar el post' });
    }
};

// Middleware para eliminar post con efecto cascada
const deletePostWithCascade = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Eliminar elementos asociados (imágenes y comentarios)
        await Promise.all([
            PostImage.deleteMany({ postId }),
            Comment.deleteMany({ postId })
        ]);

        // Eliminar el post en sí
        await Post.findByIdAndDelete(postId);

        // Invalidar cachés relacionadas
        await invalidatePostCache(postId.toString());
        await redisClient.del(`comments:post:${postId}`);
        await invalidatePostsListCache();
        await invalidateCommentsCache();

        req.postToDelete = post;
        next();
    } catch (error) {
        console.error('Error en eliminación en cascada del post:', error);
        return res.status(500).json({ error: 'Error al eliminar elementos asociados al post' });
    }
};

// Middleware para eliminar usuario con efecto cascada
const deleteUserWithCascade = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const User = require('../db/models/user');
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userComments = await Comment.find({ userId });
        const postsWithUserComments = [...new Set(userComments.map(c => c.postId.toString()))];

        const userPosts = await Post.find({ userId });
        const postIds = userPosts.map(post => post._id.toString());

        await Promise.all([
            PostImage.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ userId }),
            Post.deleteMany({ userId })
        ]);

        const allPostsToInvalidate = new Set([...postsWithUserComments, ...postIds]);
        for (const postId of allPostsToInvalidate) {
            await invalidatePostCache(postId);
            await redisClient.del(`comments:post:${postId}`);
        }
        await invalidatePostsListCache();
        await invalidateCommentsCache();

        req.userToDelete = user;
        next();
    } catch (error) {
        console.error('Error en eliminación en cascada del usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar elementos asociados al usuario' });
    }
};

module.exports = {
    validatePostExists,
    deletePostWithCascade,
    deleteUserWithCascade
}; 
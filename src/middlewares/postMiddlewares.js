const PostImage = require('../db/models/postImage');
const Comment = require('../db/models/comment');
const Post = require('../db/models/post');

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
// IMPORTANTE: Los tags NO se eliminan al eliminar un post, solo se remueven las relaciones.
// Los tags son entidades independientes que pueden ser reutilizados.
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

        // NOTA: Los tags NO se eliminan, solo se remueven las relaciones automáticamente
        // al eliminar el post, ya que están referenciados en el array del post

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

        const userPosts = await Post.find({ userId });
        const postIds = userPosts.map(post => post._id);

        // Eliminar todos los elementos asociados al usuario
        await Promise.all([
            PostImage.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ userId }),
            Post.deleteMany({ userId })
        ]);

        // NOTA: Los tags NO se eliminan, solo se remueven las relaciones

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
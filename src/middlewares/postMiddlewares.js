const PostImage = require('../db/models/postImage');
const Comment = require('../db/models/comment');
const Post = require('../db/models/post');

// Middleware para eliminar post con efecto cascada
const deletePostWithCascade = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        await Promise.all([
            PostImage.deleteMany({ postId }),
            Comment.deleteMany({ postId })
        ]);

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

        await Promise.all([
            PostImage.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ userId }),
            Post.deleteMany({ userId })
        ]);

        req.userToDelete = user;

        next();
    } catch (error) {
        console.error('Error en eliminación en cascada del usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar elementos asociados al usuario' });
    }
};

module.exports = {
    deletePostWithCascade,
    deleteUserWithCascade
}; 
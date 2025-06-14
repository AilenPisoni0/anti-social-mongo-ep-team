const { Post } = require('../db/models');

const validatePostExists = async (req, res, next) => {
    try {
        const postId = req.params.postId || req.body.postId;

        if (!postId) {
            return res.status(400).json({ error: 'Se requiere el ID del post' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Error al validar el post' });
    }
};

module.exports = {
    validatePostExists
}; 
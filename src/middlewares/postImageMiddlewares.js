const { PostImage } = require('../db/models');

const existImageInPost = () => {
    return async (req, res, next) => {
        const { id, imageId } = req.params;
        const image = await PostImage.findOne({
            where: { id: imageId, postId: id }
        });
        if (!image) {
            return res.status(404).json({ error: 'Imagen no encontrada en este post' });
        }
        next();
    }
};

module.exports = { existImageInPost };
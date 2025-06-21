// src/middlewares/postImageMiddlewares.js
const PostImage = require('../db/models/postImage');
const { handleMongoError } = require('../utils/validation');

/**
 * Middleware para verificar que una imagen existe en un post específico
 * @returns {Function} - Middleware function
 */
const existImageInPost = () => {
  return async (req, res, next) => {
    const { id: postId, imageId } = req.params;

    try {
      // Busca la imagen en la colección PostImage
      const image = await PostImage.findOne({
        _id: imageId,
        postId: postId
      });

      if (!image) {
        return res.status(404).json({ error: 'Imagen no encontrada en este post' });
      }

      next();
    } catch (err) {
      const errorResponse = handleMongoError(err, 'imagen');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
};

module.exports = {
  existImageInPost
};
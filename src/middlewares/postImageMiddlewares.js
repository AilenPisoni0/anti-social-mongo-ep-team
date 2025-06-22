// src/middlewares/postImageMiddlewares.js
const PostImage = require('../db/models/postImage');
const { handleMongoError } = require('../utils/validation');
const { invalidatePostCache, invalidatePostsListCache } = require('../utils/cacheUtils');

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

// Middleware para eliminar imagen de post con invalidación de caché
const deletePostImageWithCache = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;

    const postImage = await PostImage.findById(imageId);
    if (!postImage) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Guardar el postId antes de eliminar la imagen
    const postId = postImage.postId.toString();

    // Eliminar la imagen
    await PostImage.findByIdAndDelete(imageId);

    // Invalidar cachés del post individual y la lista completa
    await Promise.all([
      invalidatePostCache(postId),
      invalidatePostsListCache()
    ]);

    req.deletedPostImage = postImage;
    next();
  } catch (error) {
    console.error('Error en eliminación de la imagen:', error);
    return res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

module.exports = {
  existImageInPost,
  deletePostImageWithCache
};
// src/middlewares/postImageMiddlewares.js
const PostImage = require('../db/models/postImage');

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
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: `ID de imagen ${imageId} no es válido` });
      }
      res.status(500).json({ error: 'Error al verificar la imagen en el post' });
    }
  }
};

module.exports = { existImageInPost };
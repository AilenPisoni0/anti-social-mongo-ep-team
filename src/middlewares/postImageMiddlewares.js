// src/middlewares/postImageMiddlewares.js
const Post = require('../db/models/post'); // Importa el modelo Post

const existImageInPost = () => {
  return async (req, res, next) => {
    const { id: postId, imageId } = req.params; // id del post y _id de la imagen

    try {
      // Busca el post por su ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }

      // Busca la imagen dentro del array de imágenes del post por su _id
      const imageExists = post.images.some(img => img._id.toString() === imageId);

      if (!imageExists) {
        return res.status(404).json({ error: 'Imagen no encontrada en este post' });
      }

      next(); // La imagen existe en el post, continúa con la siguiente función
    } catch (err) {
      console.error(err);
      // Si el ID de la imagen no es un ObjectId válido de Mongoose, puede lanzar un error de tipo
      if (err.name === 'CastError') {
         return res.status(400).json({ message: `ID de imagen ${imageId} no es válido` });
      }
      res.status(500).json({ error: 'Error al verificar la imagen en el post' });
    }
  }
};

module.exports = { existImageInPost };
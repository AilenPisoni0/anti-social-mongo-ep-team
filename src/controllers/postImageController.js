const PostImage = require('../db/models/postImage');
const { invalidatePostCache, invalidatePostsListCache } = require('../utils/cacheUtils');

// Helper para invalidar caché de post relacionado
const invalidateRelatedPostCache = async (postId) => {
    await Promise.all([
        invalidatePostCache(postId),
        invalidatePostsListCache()
    ]);
};

module.exports = {
    // GET - Obtener todas las imágenes de un post
    getPostImages: async (req, res) => {
        try {
            const { id: postId } = req.params;

            const images = await PostImage.find({ postId });

            if (images.length === 0) {
                return res.status(204).send();
            }

            res.status(200).json(images);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudieron obtener las imágenes del post' });
        }
    },

    // POST - Crear una nueva imagen para un post
    createPostImage: async (req, res) => {
        try {
            const { id: postId } = req.params;
            const { url } = req.body;

            const newPostImage = new PostImage({
                postId,
                url
            });

            await newPostImage.save();
            await invalidateRelatedPostCache(postId);

            res.status(201).json({
                message: "Imagen del post creada exitosamente",
                image: newPostImage
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo crear la imagen del post' });
        }
    },

    // DELETE - Eliminar imagen de post
    deletePostImage: async (req, res) => {
        try {
            // El middleware ya eliminó la imagen e invalidó las cachés
            res.status(200).json({
                message: 'Imagen eliminada exitosamente',
                image: req.deletedPostImage
            });
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}; 
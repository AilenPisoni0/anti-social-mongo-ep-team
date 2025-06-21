const PostImage = require('../db/models/postImage');
const Post = require('../db/models/post');
const { redisClient } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con posts
const invalidatePostCaches = async (postId = null) => {
    if (postId) {
        await redisClient.del(`post:${postId}`);
    }
    await redisClient.del('posts:todos');
};

module.exports = {
    // GET - Obtener todas las imágenes de un post
    getPostImages: async (req, res) => {
        try {
            const { id: postId } = req.params;

            const images = await PostImage.find({ postId }).lean();

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
            await invalidatePostCaches(postId);

            res.status(201).json({
                message: "Imagen del post creada exitosamente",
                image: newPostImage
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo crear la imagen del post' });
        }
    },

    // DELETE - Eliminar una imagen específica de un post
    deletePostImage: async (req, res) => {
        try {
            const { id: postId, imageId } = req.params;

            const image = await PostImage.findOne({ _id: imageId, postId });
            if (!image) {
                return res.status(404).json({ error: 'Imagen no encontrada en este post' });
            }

            await PostImage.findByIdAndDelete(imageId);
            await invalidatePostCaches(postId);

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo eliminar la imagen' });
        }
    }
}; 
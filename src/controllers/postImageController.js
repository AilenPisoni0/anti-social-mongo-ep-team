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
    // POST - Crear una nueva imagen para un post
    createPostImage: async (req, res) => {
        try {
            const { postId, url } = req.body;

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

    // GET - Obtener todas las imágenes de un post
    getPostImages: async (req, res) => {
        try {
            const { postId } = req.params;

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

    // GET - Obtener una imagen específica
    getPostImageById: async (req, res) => {
        const { id } = req.params;
        try {
            const image = await PostImage.findById(id).lean();

            if (!image) {
                return res.status(404).json({ error: 'Imagen no encontrada' });
            }

            res.status(200).json(image);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo obtener la imagen' });
        }
    },

    // PUT - Actualizar una imagen
    updatePostImage: async (req, res) => {
        try {
            const { id } = req.params;
            const { url } = req.body;

            const image = await PostImage.findById(id);
            if (!image) {
                return res.status(404).json({ error: 'Imagen no encontrada' });
            }

            image.url = url;
            await image.save();

            await invalidatePostCaches(image.postId);

            res.status(200).json({
                message: "Imagen actualizada exitosamente",
                image: image
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo actualizar la imagen' });
        }
    },

    // DELETE - Eliminar una imagen
    deletePostImage: async (req, res) => {
        try {
            const { id } = req.params;

            const image = await PostImage.findById(id);
            if (!image) {
                return res.status(404).json({ error: 'Imagen no encontrada' });
            }

            const postId = image.postId;
            await PostImage.findByIdAndDelete(id);

            await invalidatePostCaches(postId);

            res.status(200).json({
                message: "Imagen eliminada exitosamente"
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo eliminar la imagen' });
        }
    }
}; 
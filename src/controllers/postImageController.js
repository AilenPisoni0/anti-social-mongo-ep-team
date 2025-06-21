const PostImage = require('../db/models/postImage');
const Post = require('../db/models/post');
const { redisClient } = require('../db/config/redisClient');

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

            // Limpiar cache del post
            await redisClient.del(`post:${postId}`);
            await redisClient.del('posts:todos');

            res.status(201).json(newPostImage);
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
            console.error('Error en getPostImages:', err);
            res.status(500).json({ error: 'No se pudieron obtener las imágenes del post' });
        }
    },

    // GET - Obtener una imagen específica
    getPostImageById: async (req, res) => {
        try {
            const { id } = req.params;

            const image = await PostImage.findById(id).lean();

            if (!image) {
                return res.status(404).json({ error: 'Imagen no encontrada' });
            }

            res.status(200).json(image);
        } catch (err) {
            console.error('Error en getPostImageById:', err);
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
            image.isEdited = true;
            await image.save();

            // Limpiar cache del post
            await redisClient.del(`post:${image.postId}`);
            await redisClient.del('posts:todos');

            res.status(200).json(image);
        } catch (err) {
            console.error('Error en updatePostImage:', err);
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

            // Limpiar cache del post
            await redisClient.del(`post:${postId}`);
            await redisClient.del('posts:todos');

            res.status(204).send();
        } catch (err) {
            console.error('Error en deletePostImage:', err);
            res.status(500).json({ error: 'No se pudo eliminar la imagen' });
        }
    }
}; 
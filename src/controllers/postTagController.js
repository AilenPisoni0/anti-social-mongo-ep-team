const Post = require('../db/models/post');
const Tag = require('../db/models/tag');
const { redisClient } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con posts
const invalidatePostCaches = async (postId = null) => {
    if (postId) {
        await redisClient.del(`post:${postId}`);
    }
    await redisClient.del('posts:todos');
};

// Helper para invalidar cachés relacionados con tags
const invalidateTagCaches = async (tagId = null) => {
    if (tagId) {
        await redisClient.del(`tag:${tagId}`);
        await redisClient.del(`tag:${tagId}:posts`);
    }
    await redisClient.del('tags:todos');
    await redisClient.del('posts:todos');
};

module.exports = {
    // Obtener todos los tags de un post
    getPostTags: async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId).populate('tags', 'name');

            if (!post) {
                return res.status(404).json({ error: 'Post no encontrado' });
            }

            if (!post.tags || post.tags.length === 0) {
                return res.status(204).send();
            }

            res.status(200).json(post.tags);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudieron obtener los tags del post' });
        }
    },

    // Asociar un tag específico a un post
    addTagToPost: async (req, res) => {
        try {
            const { postId, tagId } = req.params;

            // Verificar que el post existe
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post no encontrado' });
            }

            // Verificar que el tag existe
            const tag = await Tag.findById(tagId);
            if (!tag) {
                return res.status(404).json({ error: 'Tag no encontrado' });
            }

            // Verificar si el tag ya está asociado al post
            if (post.tags.includes(tagId)) {
                return res.status(400).json({ error: 'El tag ya está asociado a este post' });
            }

            // Agregar el tag al post
            post.tags.push(tagId);
            await post.save();

            // Obtener el post actualizado con tags populados
            const updatedPost = await Post.findById(postId).populate('tags', 'name');

            await invalidatePostCaches(postId);

            res.status(200).json({
                message: "Tag agregado exitosamente al post",
                tags: updatedPost.tags
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo agregar el tag' });
        }
    },

    // Remover un tag específico de un post
    removeTagFromPost: async (req, res) => {
        try {
            const { postId, tagId } = req.params;

            // Verificar que el post existe
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post no encontrado' });
            }

            // Verificar si el tag está asociado al post
            if (!post.tags.includes(tagId)) {
                return res.status(404).json({ error: 'Tag no encontrado en este post' });
            }

            // Remover el tag del post
            post.tags = post.tags.filter(tag => tag.toString() !== tagId);
            await post.save();

            await invalidatePostCaches(postId);

            res.status(200).json({
                message: "Tag eliminado exitosamente del post"
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo eliminar el tag' });
        }
    },

    // Obtener todos los posts de un tag específico
    getPostsByTag: async (req, res) => {
        try {
            const { tagId } = req.params;
            const cacheKey = `tag:${tagId}:posts`;

            const cached = await redisClient.get(cacheKey);
            if (cached) {
                console.log('Posts del tag desde Redis');
                return res.status(200).json(JSON.parse(cached));
            }

            // Verificar que el tag existe
            const tag = await Tag.findById(tagId);
            if (!tag) {
                return res.status(404).json({ error: 'Tag no encontrado' });
            }

            // Obtener posts que contengan este tag
            const posts = await Post.find({ tags: tagId })
                .populate('userId', 'nickName')
                .populate('tags', 'name')
                .populate('postImages', 'url')
                .sort({ createdAt: -1 })
                .lean();

            if (posts.length === 0) {
                return res.status(204).json({ message: 'No hay posts con este tag' });
            }

            await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });
            res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudieron obtener los posts del tag' });
        }
    }
}; 
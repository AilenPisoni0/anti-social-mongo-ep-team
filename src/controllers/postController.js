const mongoose = require('mongoose');
const Post = require('../db/models/post');
const Tag = require('../db/models/tag');
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient } = require('../db/config/redisClient');

module.exports = {
  createPost: async (req, res) => {
    try {
      const { description, userId, images, tags } = req.body;

      const newPost = new Post({
        description,
        userId,
        images: images || [],
        tags: tags || [],
        isDeleted: false,
        isEdited: false
      });

      await newPost.save();
      await redisClient.del('posts:todos');

      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el post' });
    }
  },

  getAllPosts: async (req, res) => {
    const cacheKey = 'posts:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('[Redis] Post desde caché');

        return res.status(200).json(JSON.parse(cached));
      }

      const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

      const posts = await Post.find()
        .populate('tags', 'id name')
        .populate({
          path: 'comments',
          match: { createdAt: { $gte: cutoffDate } },
          populate: {
            path: 'userId',
            select: 'nickName'
          }
        })
        .sort({ createdAt: -1 })
        .lean();

      await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });
      res.status(200).json(posts);
    } catch (err) {
      console.error("Error en getAllPosts:", err);
      res.status(500).json({ error: 'No se pudieron obtener los posts' });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `post:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
      console.log('[Redis] Post desde caché');
  return res.status(200).json(JSON.parse(cached));
      }

      const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

      const post = await Post.findById(id)
        .populate('tags', 'name')
        .populate({
          path: 'comments',
          match: { createdAt: { $gte: cutoffDate } },
          populate: {
            path: 'userId',
            select: 'nickName'
          }
        })
        .lean();

      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(post), { EX: 300 });
      res.status(200).json(post);
    } catch (err) {
      console.error('Error en getPostById:', err);
      res.status(500).json({ error: 'No se pudo obtener el post' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { description, userId } = req.body;
      const post = await Post.findById(req.params.id);

      post.description = description ?? post.description;
      post.userId = userId ?? post.userId;
      post.isEdited = true;
      await post.save();

      await redisClient.del(`post:${req.params.id}`);
      await redisClient.del('posts:todos');

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      await post.deleteOne();
      await redisClient.del(`post:${req.params.id}`);
      await redisClient.del('posts:todos');
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  },

  getPostImages: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).lean();

      if (!post || !post.images) {
        return res.status(404).json({ message: 'Imágenes no encontradas' });
      }

      res.status(200).json(post.images);
    } catch (err) {
      console.error('Error en getPostImages:', err);
      res.status(500).json({ error: 'No se pudieron obtener las imágenes del post' });
    }
  },

  addImageFromPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { url } = req.body;

      const post = await Post.findById(id);
      post.images.push({ url });
      await post.save();

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(200).json(post.images);
    } catch (err) {
      console.error('Error en addImageFromPost:', err);
      res.status(500).json({ error: 'No se pudo agregar la imagen' });
    }
  },

  removeImageFromPost: async (req, res) => {
    try {
      const { id, imageId } = req.params;
      const post = await Post.findById(id);

      post.images = post.images.filter(img => img._id.toString() !== imageId);
      await post.save();

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(204).send();
    } catch (err) {
      console.error('Error en removeImageFromPost:', err);
      res.status(500).json({ error: 'No se pudo eliminar la imagen' });
    }
  },

  getPostTags: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate('tags', 'name');

      if (!post || !post.tags) {
        return res.status(404).json({ message: 'Tags no encontrados' });
      }

      res.status(200).json(post.tags);
    } catch (err) {
      console.error('Error en getPostTags:', err);
      res.status(500).json({ error: 'No se pudieron obtener los tags del post' });
    }
  },

  addTagFromPost: async (req, res) => {
    try {
      const { id, tagId } = req.params;
      const post = await Post.findById(id);

      if (!post.tags.includes(tagId)) {
        post.tags.push(tagId);
        await post.save();

        await redisClient.del(`post:${id}`);
        await redisClient.del('posts:todos');
      }

      res.status(200).json(post.tags);
    } catch (err) {
      console.error('Error en addTagFromPost:', err);
      res.status(500).json({ error: 'No se pudo agregar el tag' });
    }
  },

  removeTagFromPost: async (req, res) => {
    try {
      const { id, tagId } = req.params;
      const post = await Post.findById(id);

      post.tags = post.tags.filter(tag => tag.toString() !== tagId);
      await post.save();

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(204).send();
    } catch (err) {
      console.error('Error en removeTagFromPost:', err);
      res.status(500).json({ error: 'No se pudo eliminar el tag' });
    }
  }
};

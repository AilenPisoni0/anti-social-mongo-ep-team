const mongoose = require('mongoose');
const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Tag = require('../db/models/tag');
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con posts
const invalidatePostCaches = async (postId = null) => {
  if (postId) {
    await redisClient.del(`post:${postId}`);
  }
  await redisClient.del('posts:todos');
};

// Helper para obtener posts con formato unificado
const getPostWithPopulatedData = async (postId) => {
  const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

  return await Post.findById(postId)
    .populate('tags', 'name')
    .populate('postImages', 'url')
    .populate({
      path: 'comments',
      match: { createdAt: { $gte: cutoffDate } },
      populate: {
        path: 'userId',
        select: 'nickName'
      }
    })
    .lean();
};

// Helper para obtener múltiples posts con formato unificado
const getPostsWithPopulatedData = async () => {
  const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

  return await Post.find()
    .populate('tags', 'name')
    .populate('postImages', 'url')
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
};

module.exports = {
  createPost: async (req, res) => {
    try {
      const { description, userId, tags, imagenes } = req.body;

      const newPost = new Post({
        description,
        userId,
        tags: tags || []
      });

      await newPost.save();

      // Crear imágenes si se proporcionaron URLs
      if (imagenes && imagenes.length > 0) {
        const postImages = imagenes.map(url => ({
          postId: newPost._id,
          url
        }));

        await PostImage.insertMany(postImages);
      }

      // Obtener el post con formato unificado
      const postWithData = await getPostWithPopulatedData(newPost._id);

      await invalidatePostCaches();

      res.status(201).json({
        message: "Post creado exitosamente",
        post: postWithData
      });
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
        console.log('Posts desde Redis');
        const posts = JSON.parse(cached);
        return posts.length === 0 ? res.status(204).send() : res.status(200).json(posts);
      }

      const posts = await getPostsWithPopulatedData();

      if (posts.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los posts' });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `post:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Post desde Redis');
        return res.status(200).json(JSON.parse(cached));
      }

      const post = await getPostWithPopulatedData(id);

      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(post), { EX: 300 });
      res.status(200).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo obtener el post' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { description, userId, tags, imagenes } = req.body;
      const post = await Post.findById(req.params.id);

      if (description !== undefined) post.description = description;
      if (userId !== undefined) post.userId = userId;
      if (tags !== undefined) post.tags = tags;

      await post.save();

      // Actualizar imágenes si se proporcionaron
      if (imagenes !== undefined) {
        // Eliminar imágenes existentes
        await PostImage.deleteMany({ postId: post._id });

        // Crear nuevas imágenes
        if (imagenes.length > 0) {
          const postImages = imagenes.map(url => ({
            postId: post._id,
            url
          }));
          await PostImage.insertMany(postImages);
        }
      }

      // Obtener el post actualizado con formato unificado
      const updatedPost = await getPostWithPopulatedData(post._id);

      await invalidatePostCaches(req.params.id);

      res.status(200).json({
        message: "Post actualizado exitosamente",
        post: updatedPost
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  },

  deletePost: async (req, res) => {
    try {
      // El middleware ya eliminó los elementos asociados y verificó que el post existe
      await Post.findByIdAndDelete(req.params.id);

      await invalidatePostCaches(req.params.id);

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  },

  addTagToPost: async (req, res) => {
    try {
      const { id: postId, tagId } = req.params;

      // Verificar que el tag existe
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      // Verificar que el post no tenga ya este tag
      const post = await Post.findById(postId);
      if (post.tags.includes(tagId)) {
        return res.status(400).json({ error: 'El post ya tiene este tag asociado' });
      }

      // Agregar el tag al post
      post.tags.push(tagId);
      await post.save();

      // Obtener el post actualizado con formato unificado
      const updatedPost = await getPostWithPopulatedData(postId);

      await invalidatePostCaches(postId);

      res.status(200).json({
        message: "Tag agregado al post exitosamente",
        post: updatedPost
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo agregar el tag al post' });
    }
  },

  removeTagFromPost: async (req, res) => {
    try {
      const { id: postId, tagId } = req.params;

      // Verificar que el tag existe
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      // Verificar que el post tenga este tag
      const post = await Post.findById(postId);
      if (!post.tags.includes(tagId)) {
        return res.status(400).json({ error: 'El post no tiene este tag asociado' });
      }

      // Remover el tag del post
      post.tags = post.tags.filter(id => id.toString() !== tagId);
      await post.save();

      // Obtener el post actualizado con formato unificado
      const updatedPost = await getPostWithPopulatedData(postId);

      await invalidatePostCaches(postId);

      res.status(200).json({
        message: "Tag removido del post exitosamente",
        post: updatedPost
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo remover el tag del post' });
    }
  },

  getPostTags: async (req, res) => {
    try {
      const { id: postId } = req.params;

      const post = await Post.findById(postId).populate('tags', 'name').lean();

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
  }
};
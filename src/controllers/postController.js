const mongoose = require('mongoose');
const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Tag = require('../db/models/tag');
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient } = require('../db/config/redisClient');
const { uploadMiddleware } = require("../middlewares");

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
      const { description, userId, tags } = req.body;
      const files = req.files;

      const newPost = new Post({
        description,
        userId,
        tags: tags || []
      });

      await newPost.save();

      // Crear imágenes si se subieron archivos
      if (files && files.length > 0) {
        const postImages = files.map(file => ({
          postId: newPost._id,
          url: `/uploads/images/${file.filename}` // Ruta relativa al servidor
        }));

        await PostImage.insertMany(postImages);
      }

      // Obtener el post con formato unificado
      const postWithData = await getPostWithPopulatedData(newPost._id);

      await redisClient.del('posts:todos');

      res.status(201).json(postWithData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear la publicación' });
    }
  },

  getAllPosts: async (req, res) => {
    const cacheKey = 'posts:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('[Redis] Post desde caché');
        const posts = JSON.parse(cached);
        if (posts.length === 0) {
          return res.status(204).send();
        }
        return res.status(200).json(posts);
      }

      const posts = await getPostsWithPopulatedData();

      if (posts.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 300 });
      res.status(200).json(posts);
    } catch (err) {
      console.error("Error en getAllPosts:", err);
      res.status(500).json({ error: 'Error interno del servidor' });
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

      const post = await getPostWithPopulatedData(id);

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

      await redisClient.del(`post:${req.params.id}`);
      await redisClient.del('posts:todos');

      res.status(201).json(updatedPost);
    } catch (err) {
      console.error('Error en updatePost:', err);
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  },

  deletePost: async (req, res) => {
    try {
      // El middleware ya eliminó los elementos asociados y verificó que el post existe
      await Post.findByIdAndDelete(req.params.id);

      await redisClient.del(`post:${req.params.id}`);
      await redisClient.del('posts:todos');

      res.status(200).json({
        message: "Publicación eliminada exitosamente junto con todos sus recursos asociados"
      });
    } catch (err) {
      console.error('Error en deletePost:', err);
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  },

  getPostImages: async (req, res) => {
    try {
      const { id } = req.params;
      const images = await PostImage.find({ postId: id });

      if (!images || images.length === 0) {
        return res.status(404).json({ message: 'Imágenes no encontradas' });
      }

      res.status(200).json(images);
    } catch (err) {
      console.error('Error en getPostImages:', err);
      res.status(500).json({ error: 'No se pudieron obtener las imágenes del post' });
    }
  },

  addImageFromPost: async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Debe subir una imagen' });
      }

      const newImage = new PostImage({
        postId: id,
        url: `/uploads/images/${file.filename}`
      });
      await newImage.save();

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(201).json(newImage);
    } catch (err) {
      console.error('Error en addImageFromPost:', err);
      res.status(500).json({ error: 'No se pudo agregar la imagen' });
    }
  },

  updateImageFromPost: async (req, res) => {
    try {
      const { id, imageId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Debe subir una imagen' });
      }

      const image = await PostImage.findById(imageId);
      if (!image) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      // borrar el archivo anterior del disco
      const fs = require('fs');
      const path = require('path');
      if (image.url) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../', image.url));
        } catch (e) { /* ignorar error si no existe */ }
      }

      image.url = `/uploads/images/${file.filename}`;
      await image.save();

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(200).json(image);
    } catch (err) {
      console.error('Error en updateImageFromPost:', err);
      res.status(500).json({ error: 'No se pudo actualizar la imagen' });
    }
  },

  removeImageFromPost: async (req, res) => {
    try {
      const { id, imageId } = req.params;

      // Verificar que la imagen existe antes de eliminarla
      const image = await PostImage.findById(imageId);
      if (!image) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      await PostImage.findByIdAndDelete(imageId);

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(200).json({
        message: "Imagen eliminada exitosamente"
      });
    } catch (err) {
      console.error('Error en removeImageFromPost:', err);
      res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
  },

  updatePostImages: async (req, res) => {
    try {
      const { id } = req.params;
      const { imagenes } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Publicación no encontrada' });
      }

      await PostImage.deleteMany({ postId: id });

      if (imagenes && imagenes.length > 0) {
        const postImages = imagenes.map(url => ({
          postId: id,
          url
        }));
        await PostImage.insertMany(postImages);
      }

      const updatedPost = await getPostWithPopulatedData(id);

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

      res.status(200).json({
        message: "Publicación actualizada exitosamente",
        post: updatedPost
      });
    } catch (err) {
      console.error('Error en updatePostImages:', err);
      res.status(500).json({ error: 'Error al actualizar la publicación' });
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
      }

      await redisClient.del(`post:${id}`);
      await redisClient.del('posts:todos');

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
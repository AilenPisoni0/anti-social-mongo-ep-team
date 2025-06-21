const mongoose = require('mongoose');
const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Tag = require('../db/models/tag');
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient } = require('../db/config/redisClient');
const { uploadMiddleware } = require("../middlewares");

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

      res.status(200).json({
        message: "Post eliminado exitosamente junto con todos sus recursos asociados"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el post' });
    }
  },

  getPostImages: async (req, res) => {
    try {
      const { id } = req.params;
      const images = await PostImage.find({ postId: id });

      if (!images || images.length === 0) {
        return res.status(204).send();
      }

      res.status(200).json(images);
    } catch (err) {
      console.error(err);
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

      await invalidatePostCaches(id);

      res.status(201).json({
        message: "Imagen agregada exitosamente al post",
        image: newImage
      });
    } catch (err) {
      console.error(err);
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

      await invalidatePostCaches(id);

      res.status(200).json({
        message: "Imagen actualizada exitosamente",
        image: image
      });
    } catch (err) {
      console.error(err);
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

      await invalidatePostCaches(id);

      res.status(200).json({
        message: "Imagen eliminada exitosamente"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar la imagen' });
    }
  },

  updatePostImages: async (req, res) => {
    try {
      const { id } = req.params;
      const { imagenes } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
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

      await invalidatePostCaches(id);

      res.status(200).json({
        message: "Imágenes del post actualizadas exitosamente",
        post: updatedPost
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron actualizar las imágenes del post' });
    }
  }
};
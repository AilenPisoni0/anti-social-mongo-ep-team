// src/controllers/postController.js
const mongoose = require('mongoose');
const  Post = require('../db/models/post');
const Tag = require('../db/models/tag');
const Comment= require('../db/models/comment');
const  User  = require('../db/models/user');


module.exports = {
  // Crear un nuevo post
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

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear el post' });
  }
},
  // Obtener todos los posts
 getAllPosts : async (req, res) => {
  try {
    const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    const posts = await Post.find()
      .populate('tags', 'id name')  // trae solo id y name de tags
      .populate({
        path: 'comments',
        match: { createdAt: { $gte: cutoffDate } }, // filtra comentarios por fecha
        populate: {
          path: 'userId',
          select: 'nickName'  // solo nickname del usuario
        }
      })
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(204).json({ message: 'No hay contenido' });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error en getAllPosts:", err);
    res.status(500).json({ error: 'No se pudieron obtener los posts' });
  }
},

  // Obtener un post por ID
  
getPostById: async (req, res) => {
  try {
    const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    const post = await Post.findById(req.params.id)
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

    res.status(200).json(post);
  } catch (err) {
    console.error('Error en getPostById:', err);
    res.status(500).json({ error: 'No se pudo obtener el post' });
  }
},


  // Actualizar un post
  updatePost: async (req, res) => {
    try {
      const { description, userId } = req.body;
      const post = await Post.findById(req.params.id);
  
      post.description = description ?? post.description;
      post.userId = userId ?? post.userId;
      post.isEdited = true;
      await post.save();
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  },

  // Eliminar un post
deletePost: async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    await post.deleteOne(); 
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'No se pudo eliminar el post' });
  }
},
  addImageFromPost: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      const { url } = req.body;

      const newImage = await PostImage.create({ postId: req.params.id, url });
      await post.update({ isEdited: true });

      res.status(201).json(newImage);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo agregar la imagen al post' });
    }
  },

  removeImageFromPost: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      const { id, imageId } = req.params;

      await PostImage.destroy({ where: { id: imageId, postId: id } });
      await post.update({ isEdited: true });

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar la imagen del post' });
    }
  },

  // Agregar tag a un post
  addTagFromPost: async (req, res) => {
    try {
      const { id, tagId } = req.params;

      // Verificar que no exista ya la asociación
      const existingAssociation = await PostTag.findOne({
        where: { postId: id, tagId }
      });

      if (existingAssociation) {
        return res.status(400).json({ error: 'El tag ya está asociado a este post' });
      }

      await PostTag.create({ postId: id, tagId });
      const post = await Post.findByPk(req.params.id);
      await post.update({ isEdited: true });

      const associatedTag = await Tag.findByPk(tagId, {
        attributes: ['id', 'name']
      });

      res.status(201).json(associatedTag);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo asociar el tag al post' });
    }
  },

  removeTagFromPost: async (req, res) => {
    try {
      const { id, tagId } = req.params;

      await PostTag.destroy({ where: { postId: id, tagId } });
      const post = await Post.findByPk(req.params.id);
      await post.update({ isEdited: true });

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar el tag del post' });
    }
  },


  getPostImages: async (req, res) => {
    try {
      const images = await PostImage.findAll({
        where: { postId: req.params.id },
        attributes: ['id', 'url', 'isEdited', 'createdAt']
      });

      if (images.length === 0) {
        return res.status(204).json({ message: 'El post no tiene imágenes' });
      }

      res.status(200).json(images);
    } catch (err) {
      res.status(500).json({ error: 'No se pudieron obtener las imágenes' });
    }
  },

  getPostTags: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id, {
        include: [{
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }]
      });

      if (post.Tags.length === 0) {
        return res.status(204).json({ message: 'El post no tiene tags' });
      }

      res.status(200).json(post.Tags);
    } catch (err) {
      res.status(500).json({ error: 'No se pudieron obtener los tags' });
    }
  }
};
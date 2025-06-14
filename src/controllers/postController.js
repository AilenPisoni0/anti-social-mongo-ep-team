// src/controllers/postController.js
const { Post, PostImage, Tag, PostTag, Comment, User } = require('../db/models');
const { Op } = require('sequelize');

module.exports = {
  // Crear un nuevo post
  createPost: async (req, res) => {
    try {
      const { description, userId } = req.body;
      const newPost = await Post.create({
        description,
        userId,
        isDeleted: false,
        isEdited: false
      });
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo crear el post' });
    }
  },

  // Obtener todos los posts
 getAllPosts: async (req, res) => {
  try {
    const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    const posts = await Post.findAll({
      include: [
        {
          model: PostImage,
          attributes: ['id', 'url', 'isEdited', 'createdAt']
        },
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: Comment,
          required: false,
          where: {
            createdAt: {
              [Op.gte]: cutoffDate
            }
          },
          include: [
            {
              model: User,
              attributes: ['nickName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

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

    const postWithDetails = await Post.findByPk(req.params.id, {
      include: [
        {
          model: PostImage,
          attributes: ['id', 'url', 'isEdited', 'createdAt']
        },
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        {
          model: Comment,
          required: false,
          where: {
            createdAt: {
              [Op.gte]: cutoffDate
            }
          },
          include: [
            {
              model: User,
              attributes: ['nickName']
            }
          ]
        }
      ]
    });

    if (!postWithDetails) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json(postWithDetails);
  } catch (err) {
    console.error('Error en getPostById:', err);
    res.status(500).json({ error: 'No se pudo obtener el post' });
  }
},


  // Actualizar un post
  updatePost: async (req, res) => {
    try {
      const { description, userId } = req.body;
      
      const post = await Post.findByPk(req.params.id);

      await post.update({
        description,
        userId,
        isEdited: true
      });

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo actualizar el post' });
    }
  },

  // Eliminar un post
  deletePost: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      await post.destroy();
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
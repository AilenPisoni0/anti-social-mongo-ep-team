const { Comment, User } = require('../db/models');
const { Op } = require('sequelize');

module.exports = {
  // Crear un nuevo comentario
  createComment: async (req, res) => {
    try {
      const { content, userId, postId } = req.body;

      const newComment = await Comment.create({
        content,
        userId,
        postId,
        isEdited: false,
      });

      // Obtener comentario con usuario asociado (nickName)
      const commentWithUser = await Comment.findByPk(newComment.id, {
        include: {
          model: User,
          attributes: ['nickName'],
        },
      });

      res.status(201).json(commentWithUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el comentario' });
    }
  },

  // Obtener comentarios de un post específico (solo recientes)
  getPostComments: async (req, res) => {
    try {
      const { id } = req.params;
      const maxAgeMonths = process.env.MAX_COMMENT_AGE_MONTHS || 6;

      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

      const comments = await Comment.findAll({
        where: {
          postId: id,
          createdAt: {
            [Op.gte]: cutoffDate,
          },
        },
        include: {
          model: User,
          attributes: ['nickName'],
        },
        order: [['createdAt', 'DESC']],
      });

      if (comments.length === 0) {
        return res.status(204).json({ message: 'No hay comentarios para mostrar' });
      }

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los comentarios' });
    }
  },

  // Obtener todos los comentarios
  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: {
          model: User,
          attributes: ['nickName'],
        },
        order: [['createdAt', 'DESC']],
      });

      if (comments.length === 0) {
        return res.status(204).json({ message: 'No hay comentarios para mostrar' });
      }

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los comentarios' });
    }
  },

  // Obtener un comentario por ID
  getCommentById: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id, {
        include: {
          model: User,
          attributes: ['nickName'],
        },
      });

      if (!comment) {
        return res.status(204).json({ message: 'No hay comentarios para mostrar' });
      }

      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo obtener el comentario' });
    }
  },

  // Actualizar un comentario (contenido y/o fecha)
 updateComment: async (req, res) => {
  try {
    const { id } = req.params;
    const { content, createdAt } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const updates = {};
    if (content) {
      updates.content = content;
      updates.isEdited = true;
    }
    if (createdAt) {
      updates.createdAt = new Date(createdAt);
    }

    await comment.update(updates);

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo actualizar el comentario' });
  }
},


  // Eliminar un comentario
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      await comment.destroy(); // elimina el registro en Sequelize

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el comentario' });
    }
  },
};

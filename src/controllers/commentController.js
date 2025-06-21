const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient } = require('../db/config/redisClient');

module.exports = {
  // Crear un nuevo comentario
  createComment: async (req, res) => {
    try {
      const { content, userId, postId } = req.body;

      const newComment = new Comment({
        content,
        userId,
        postId,
        isEdited: false
      });

      await newComment.save();

      // Invalido caches relevantes
      await redisClient.del('comments:todos');
      await redisClient.del(`comments:post:${postId}`);

      const commentWithUser = await Comment.findById(newComment._id)
        .populate({
          path: 'userId',
          select: 'nickName'
        });

      res.status(201).json({
        message: "Comentario creado exitosamente",
        comment: commentWithUser
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el comentario' });
    }
  },

  // Obtener comentarios de un post específico (solo recientes)
  getPostComments: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const cacheKey = `comments:post:${postId}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Respuesta desde Redis - comentarios por post');
        const comments = JSON.parse(cached);
        if (comments.length === 0) {
          return res.status(204).send();
        }
        return res.status(200).json(comments);
      }

      const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

      const comments = await Comment.find({
        postId,
        createdAt: { $gte: cutoffDate }
      })
        .populate('userId', 'nickName')
        .sort({ createdAt: -1 });

      if (comments.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(comments), { EX: 300 });

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener todos los comentarios
  getAllComments: async (req, res) => {
    const cacheKey = 'comments:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Respuesta desde Redis - todos los comentarios');
        const comments = JSON.parse(cached);
        if (comments.length === 0) {
          return res.status(204).send();
        }
        return res.status(200).json(comments);
      }

      const comments = await Comment.find()
        .populate('userId', 'nickName')
        .sort({ createdAt: -1 });

      if (comments.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(comments), { EX: 300 });

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener un comentario por ID
  getCommentById: async (req, res) => {
    try {
      const { id } = req.params;
      const cacheKey = `comment:${id}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Respuesta desde Redis - comentario por ID');
        return res.status(200).json(JSON.parse(cached));
      }

      const comment = await Comment.findById(id)
        .populate('userId', 'nickName');

      if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(comment), { EX: 300 });

      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo obtener el comentario' });
    }
  },

  // Actualizar un comentario
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, postId, userId } = req.body;

      const updates = {};
      if (content) {
        updates.content = content;
        updates.isEdited = true;
      }
      if (postId) {
        updates.postId = postId;
      }
      if (userId) {
        updates.userId = userId;
      }
      updates.updatedAt = new Date();

      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      ).populate('userId', 'nickName');

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      // Invalido caches relevantes
      await redisClient.del(`comment:${id}`);
      await redisClient.del('comments:todos');
      if (postId) {
        await redisClient.del(`comments:post:${postId}`);
      }

      res.status(201).json({
        message: "Comentario actualizado exitosamente",
        comment: updatedComment
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo actualizar el comentario' });
    }
  },

  // Eliminar un comentario
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      const postId = comment.postId;

      await comment.deleteOne();

      // Invalido caches relevantes
      await redisClient.del(`comment:${id}`);
      await redisClient.del('comments:todos');
      if (postId) {
        await redisClient.del(`comments:post:${postId}`);
      }

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el comentario' });
    }
  }
};

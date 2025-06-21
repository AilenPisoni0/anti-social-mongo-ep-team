const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient, CACHE_TTL } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con comentarios
const invalidateCommentCaches = async (commentId = null, postId = null) => {
  if (commentId) {
    await redisClient.del(`comment:${commentId}`);
  }
  if (postId) {
    await redisClient.del(`comments:post:${postId}`);
  }
  await redisClient.del('comments:todos');
};

module.exports = {
  // Crear un nuevo comentario
  createComment: async (req, res) => {
    try {
      const { content, userId, postId } = req.body;

      const newComment = new Comment({
        content,
        userId,
        postId
      });

      await newComment.save();

      await invalidateCommentCaches(null, postId);

      res.status(201).json(newComment);
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
        console.log('Comentarios del post desde Redis');
        const comments = JSON.parse(cached);
        return comments.length === 0 ? res.status(204).send() : res.status(200).json(comments);
      }

      const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

      const comments = await Comment.find({
        postId,
        createdAt: { $gte: cutoffDate }
      })
        .sort({ createdAt: -1 });

      if (comments.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(comments), { EX: CACHE_TTL.COMMENTS });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los comentarios del post' });
    }
  },

  // Obtener todos los comentarios
  getAllComments: async (req, res) => {
    const cacheKey = 'comments:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Todos los comentarios desde Redis');
        const comments = JSON.parse(cached);
        return comments.length === 0 ? res.status(204).send() : res.status(200).json(comments);
      }

      const comments = await Comment.find()
        .sort({ createdAt: -1 });

      if (comments.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(comments), { EX: CACHE_TTL.COMMENTS });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los comentarios' });
    }
  },

  // Obtener un comentario por ID
  getCommentById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `comment:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Comentario desde Redis');
        return res.status(200).json(JSON.parse(cached));
      }

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(comment), { EX: CACHE_TTL.COMMENTS });
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
      const { content, createdAt } = req.body;

      const updates = {};
      if (content) {
        updates.content = content;
      }
      if (createdAt) {
        updates.createdAt = new Date(createdAt);
      }
      updates.updatedAt = new Date();

      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      await invalidateCommentCaches(id, updatedComment.postId);

      res.status(200).json(updatedComment);
    } catch (err) {
      console.error('Error en updateComment:', err);
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

      await invalidateCommentCaches(id, postId);

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el comentario' });
    }
  }
};

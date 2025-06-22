/**
 * Middleware para validar campos permitidos en actualización de comentarios
 * @returns {Function} - Middleware function
 */
const validateUpdateFields = () => {
   return (req, res, next) => {
      try {
         if (!req.body) {
            return res.status(400).json({
               error: 'El cuerpo de la petición es requerido'
            });
         }
         if (typeof req.body !== 'object') {
            return res.status(400).json({
               error: 'El cuerpo de la petición debe ser un objeto JSON'
            });
         }
         const allowedFields = ['content', 'createdAt'];
         const receivedFields = Object.keys(req.body);
         const hasInvalidFields = receivedFields.some(field => !allowedFields.includes(field));
         if (hasInvalidFields) {
            return res.status(400).json({
               error: 'Solo se puede actualizar el contenido o la fecha del comentario'
            });
         }
         next();
      } catch (error) {
         return res.status(500).json({
            error: 'Error interno en validación de campos'
         });
      }
   }
}

const Comment = require('../db/models/comment');
const { invalidatePostCache, invalidateCommentsCache, invalidatePostCommentsCache, invalidatePostsListCache } = require('../utils/cacheUtils');

// Middleware para eliminar comentario con invalidación de caché
const deleteCommentWithCache = async (req, res, next) => {
   try {
      const commentId = req.params.id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
         return res.status(404).json({ error: 'Comentario no encontrado' });
      }

      const postId = comment.postId.toString();

      await Comment.findByIdAndDelete(commentId);

      await Promise.all([
         invalidatePostCache(postId),
         invalidateCommentsCache(),
         invalidatePostCommentsCache(postId),
         invalidatePostsListCache()
      ]);

      req.deletedComment = comment;
      next();
   } catch (error) {
      console.error('Error en eliminación del comentario:', error);
      return res.status(500).json({ error: 'Error al eliminar el comentario' });
   }
};

module.exports = {
   validateUpdateFields,
   deleteCommentWithCache
};
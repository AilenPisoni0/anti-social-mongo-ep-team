const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { genericMiddleware, commentMiddleware } = require("../middlewares");
const { CommentSchema, CommentUpdateSchema } = require("../schemas/");
const Comment = require("../db/models/comment");
const Post = require("../db/models/post");
const User = require("../db/models/user");

// Crear comentario
router.post('/',
  genericMiddleware.schemaValidator(CommentSchema),
  genericMiddleware.createUserExistsValidator(),
  genericMiddleware.createPostExistsValidator(),
  commentController.createComment
);

// Obtener todos los comentarios
router.get('/',
  commentController.getAllComments
);

// Obtener comentarios de un post específico
router.get('/post/:id',
  genericMiddleware.validateMongoId,
  genericMiddleware.createEntityExistsValidator(Post, 'Post'),
  commentController.getPostComments
);

// Obtener comentario por ID
router.get('/:id',
  genericMiddleware.validateMongoId,
  genericMiddleware.createEntityExistsValidator(Comment, 'Comentario'),
  commentController.getCommentById
);

// Actualizar comentario
router.put('/:id',
  genericMiddleware.validateMongoId,
  genericMiddleware.createEntityExistsValidator(Comment, 'Comentario'),
  commentMiddleware.validateUpdateFields(),
  genericMiddleware.schemaValidator(CommentUpdateSchema),
  commentController.updateComment
);

// Eliminar comentario
router.delete('/:id',
  genericMiddleware.validateMongoId,
  commentMiddleware.deleteCommentWithCache,
  commentController.deleteComment
);

module.exports = router;
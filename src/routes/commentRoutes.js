const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { genericMiddleware, commentMiddleware } = require("../middlewares");
const { CommentSchema } = require("../schemas/");
const { Comment, Post, User } = require("../db/models");

router.post('/',
  genericMiddleware.schemaValidator(CommentSchema),
  genericMiddleware.existModelByUserIdInBody(User),
  genericMiddleware.existModelByPostIdInBody(Post),
  commentController.createComment
);

router.get('/',
  commentController.getAllComments
);

router.get('/post/:id', commentController.getPostComments);

router.get('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentController.getCommentById
);


router.put('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentMiddleware.validateUpdateFields(),
  commentController.updateComment
);

router.delete('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentController.deleteComment
);

module.exports = router;
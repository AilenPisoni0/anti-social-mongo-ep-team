const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { genericMiddleware, commentMiddleware } = require("../middlewares");
const { CommentSchema } = require("../schemas/");
const Comment = require("../db/models/comment");
const Post = require("../db/models/post");
const User = require("../db/models/user");
//OK
router.post('/',
  genericMiddleware.schemaValidator(CommentSchema),
  genericMiddleware.existModelByUserIdInBody(User),
  genericMiddleware.existModelByPostIdInBody(Post),
  commentController.createComment
);
//OK
router.get('/',
  commentController.getAllComments
);
//OK
router.get('/post/:id', commentController.getPostComments);
//OK
router.get('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentController.getCommentById
);

//OK
router.put('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentMiddleware.validateUpdateFields(),
  commentController.updateComment
);
//OK
router.delete('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(Comment),
  commentController.deleteComment
);

module.exports = router;
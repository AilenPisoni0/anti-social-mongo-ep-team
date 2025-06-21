const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const postImageController = require('../controllers/postImageController');
const { genericMiddleware, postMiddleware, userMiddleware } = require("../middlewares");
const { createPostSchema, updatePostSchema, createPostImageSchema } = require("../schemas");
const Post = require("../db/models/post");
const User = require("../db/models/user");

router.get('/', postController.getAllPosts);

router.post('/',
    genericMiddleware.schemaValidator(createPostSchema),
    userMiddleware.existUserModelById(),
    postController.createPost
);

router.get('/:id', postController.getPostById);

router.put('/:id',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    genericMiddleware.schemaValidator(updatePostSchema),
    userMiddleware.existUserModelById(),
    postController.updatePost
);

//DELETE con efecto cascada
router.delete('/:id',
    genericMiddleware.validateMongoId,
    postMiddleware.deletePostWithCascade,
    postController.deletePost
);

// Rutas anidadas para imágenes de posts
router.get('/:id/images',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postImageController.getPostImages
);

router.post('/:id/images',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    genericMiddleware.schemaValidator(createPostImageSchema),
    postImageController.createPostImage
);

router.delete('/:id/images/:imageId',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postImageController.deletePostImage
);

// Rutas para comentarios de posts
router.get('/:id/comments',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    commentController.getPostComments
);

// Rutas para tags de posts
router.get('/:id/tags',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postController.getPostTags
);

// Rutas para tags individuales de posts
router.post('/:id/tags/:tagId',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postController.addTagToPost
);

router.delete('/:id/tags/:tagId',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postController.removeTagFromPost
);

module.exports = router;
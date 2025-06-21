const express = require('express');
const router = express.Router();
const postTagController = require('../controllers/postTagController');
const { genericMiddleware } = require("../middlewares");
const { Tag, Post } = require("../db/models");

// Obtener todos los tags de un post
router.get('/posts/:postId/tags',
    genericMiddleware.validatePostId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postTagController.getPostTags
);

// Asociar un tag específico a un post
router.post('/posts/:postId/tags/:tagId',
    genericMiddleware.validatePostId,
    genericMiddleware.validateTagId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    genericMiddleware.createEntityExistsValidator(Tag, 'Tag'),
    postTagController.addTagToPost
);

// Remover un tag específico de un post
router.delete('/posts/:postId/tags/:tagId',
    genericMiddleware.validatePostId,
    genericMiddleware.validateTagId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    genericMiddleware.createEntityExistsValidator(Tag, 'Tag'),
    postTagController.removeTagFromPost
);

// Obtener todos los posts de un tag específico
router.get('/tags/:tagId/posts',
    genericMiddleware.validateTagId,
    genericMiddleware.createEntityExistsValidator(Tag, 'Tag'),
    postTagController.getPostsByTag
);

module.exports = router; 
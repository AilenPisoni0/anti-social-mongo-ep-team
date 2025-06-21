const express = require('express');
const router = express.Router();
const postTagController = require('../controllers/postTagController');
const { genericMiddleware } = require("../middlewares");
const { Tag, Post } = require("../db/models");

// Obtener todos los tags de un post
router.get('/posts/:postId/tags',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postTagController.getPostTags
);

// Asociar un tag específico a un post
router.post('/posts/:postId/tags/:tagId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    genericMiddleware.existModelById(Tag),
    postTagController.addTagToPost
);

// Remover un tag específico de un post
router.delete('/posts/:postId/tags/:tagId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    genericMiddleware.existModelById(Tag),
    postTagController.removeTagFromPost
);

// Obtener todos los posts de un tag específico
router.get('/tags/:tagId/posts',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Tag),
    postTagController.getPostsByTag
);

module.exports = router; 
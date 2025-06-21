const express = require('express');
const router = express.Router();
const postImageController = require('../controllers/postImageController');
const { genericMiddleware } = require("../middlewares");
const { createPostImageSchema, updatePostImageSchema } = require("../schemas");
const PostImage = require("../db/models/postImage");
const Post = require("../db/models/post");

// POST - Crear imagen para un post
router.post('/',
    genericMiddleware.schemaValidator(createPostImageSchema),
    genericMiddleware.existModelById(Post),
    postImageController.createPostImage
);

// GET - Obtener todas las imágenes de un post
router.get('/post/:postId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postImageController.getPostImages
);

// GET - Obtener una imagen específica
router.get('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(PostImage),
    postImageController.getPostImageById
);

// PUT - Actualizar una imagen
router.put('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(PostImage),
    genericMiddleware.schemaValidator(updatePostImageSchema),
    postImageController.updatePostImage
);

// DELETE - Eliminar una imagen
router.delete('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(PostImage),
    postImageController.deletePostImage
);

module.exports = router; 
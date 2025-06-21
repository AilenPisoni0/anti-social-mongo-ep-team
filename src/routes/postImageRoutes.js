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
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postImageController.createPostImage
);

// GET - Obtener todas las imágenes de un post
router.get('/post/:postId',
    genericMiddleware.validatePostId,
    genericMiddleware.createEntityExistsValidator(Post, 'Post'),
    postImageController.getPostImages
);

// GET - Obtener una imagen específica
router.get('/:id',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(PostImage, 'Imagen'),
    postImageController.getPostImageById
);

// PUT - Actualizar una imagen
router.put('/:id',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(PostImage, 'Imagen'),
    genericMiddleware.schemaValidator(updatePostImageSchema),
    postImageController.updatePostImage
);

// DELETE - Eliminar una imagen
router.delete('/:id',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(PostImage, 'Imagen'),
    postImageController.deletePostImage
);

module.exports = router; 
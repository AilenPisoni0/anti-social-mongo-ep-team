const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { genericMiddleware, postMiddleware, tagMiddleware, userMiddleware, fileValidationMiddleware, postImageMiddleware, uploadMiddleware } = require("../middlewares");
const { createPostSchema, updatePostSchema } = require("../schemas");
const Post = require("../db/models/post");
const Tag = require("../db/models/tag");
const User = require("../db/models/user");

router.get('/', postController.getAllPosts);

router.post('/',
    fileValidationMiddleware.validateRequiredFields,
    fileValidationMiddleware.validateImageFiles,
    genericMiddleware.schemaValidator(createPostSchema),
    userMiddleware.existUserModelById(User),
    postController.createPost
);

router.get('/:id', postController.getPostById);

router.put('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    fileValidationMiddleware.validateImageFiles,
    genericMiddleware.schemaValidator(updatePostSchema),
    userMiddleware.existUserModelById(User),
    postController.updatePost
);
//DELETE con efecto cascada
router.delete('/:id',
    genericMiddleware.validateId,
    postMiddleware.deletePostWithCascade,
    postController.deletePost
);

router.get('/:id/images',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postController.getPostImages
);
router.get('/:id/tags',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postController.getPostTags
);
router.post('/:id/images',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    uploadMiddleware.upload.single('imagen'),
    uploadMiddleware.handleUploadError,
    postController.addImageFromPost
);

router.delete('/:id/images/:imageId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postImageMiddleware.existImageInPost(),
    postController.removeImageFromPost
);

router.put('/:id/images',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    fileValidationMiddleware.validateImageFiles,
    postController.updatePostImages
);

router.post('/:id/tags/:tagId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    tagMiddleware.existTagModelById(Tag),
    postController.addTagFromPost
);

router.delete('/:id/tags/:tagId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    tagMiddleware.existTagModelById(Tag),
    tagMiddleware.existTagInPost(),
    postController.removeTagFromPost
);

router.get('/:id/comments',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    commentController.getPostComments
);

router.put('/:id/images/:imageId',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Post),
    postImageMiddleware.existImageInPost(),
    uploadMiddleware.upload.single('imagen'),
    uploadMiddleware.handleUploadError,
    postController.updateImageFromPost
);

module.exports = router;
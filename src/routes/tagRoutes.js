const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { genericMiddleware, tagMiddleware } = require("../middlewares");
const { TagSchema, UpdateTagSchema } = require("../schemas/");
const { Tag } = require("../db/models");

router.get('/', tagController.getAllTags);
router.post('/',
    genericMiddleware.schemaValidator(TagSchema),
    tagMiddleware.existTagByName(),
    tagController.createTag
);

router.get('/:id',
    genericMiddleware.validateMongoId,
    genericMiddleware.createEntityExistsValidator(Tag, 'Tag'),
    tagController.getTagById
);

router.put('/:id',
    genericMiddleware.validateMongoId,
    tagMiddleware.updateTagWithCache,
    tagMiddleware.existTagByName(),
    genericMiddleware.schemaValidator(UpdateTagSchema),
    tagController.updateTag
);

router.delete('/:id',
    genericMiddleware.validateMongoId,
    tagMiddleware.deleteTagWithCache,
    tagController.deleteTag
);

module.exports = router;
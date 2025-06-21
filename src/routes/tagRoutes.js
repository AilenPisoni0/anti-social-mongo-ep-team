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
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Tag),
    tagController.getTagById
);

router.put('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Tag),
    tagMiddleware.existTagByName(),
    genericMiddleware.schemaValidator(UpdateTagSchema),
    tagController.updateTag
);

router.delete('/:id',
    genericMiddleware.validateId,
    genericMiddleware.existModelById(Tag),
    tagController.deleteTag
);

module.exports = router;
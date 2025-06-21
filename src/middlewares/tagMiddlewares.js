// src/middlewares/tagMiddlewares.js
const Tag = require("../db/models/tag");
const Post = require("../db/models/post");
const { validateEntityExists, validateUniqueAttribute } = require('../utils/entityValidation');
const { handleMongoError } = require('../utils/validation');

/**
 * Middleware para verificar que un tag existe por ID
 * @param {Object} modelo - Modelo a verificar
 * @returns {Function} - Middleware function
 */
const existTagModelById = (modelo) => {
  return async (req, res, next) => {
    const tagId = req.params.tagId;

    try {
      const data = await modelo.findById(tagId);
      if (!data) {
        return res.status(404).json({ error: `Tag con ID ${tagId} no encontrado` });
      }
      next();
    } catch (err) {
      const errorResponse = handleMongoError(err, 'tag');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
};

/**
 * Middleware para verificar que un tag con nombre específico no existe
 * @returns {Function} - Middleware function
 */
const existTagByName = () => {
  return validateUniqueAttribute(Tag, 'name', 'tag', 'id');
};

/**
 * Middleware para verificar que un tag está asociado a un post
 * @returns {Function} - Middleware function
 */
const existTagInPost = () => {
  return async (req, res, next) => {
    const { id: postId, tagId } = req.params;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado para verificar el tag' });
      }

      const tagExistsInPost = post.tags.some(tag => tag.toString() === tagId);

      if (!tagExistsInPost) {
        return res.status(404).json({ error: 'Tag no encontrado en este post' });
      }
      next();
    } catch (err) {
      const errorResponse = handleMongoError(err, 'tag');
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
};

module.exports = {
  existTagByName,
  existTagInPost,
  existTagModelById
};
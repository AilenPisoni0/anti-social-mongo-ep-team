// src/middlewares/tagMiddlewares.js
const Tag = require("../db/models/tag");
const Post = require("../db/models/post");
const { validateEntityExists, validateUniqueAttribute } = require('../utils/entityValidation');
const { handleMongoError } = require('../utils/validation');
const { invalidatePostCache, invalidatePostsListCache, invalidateCommentsCache } = require('../utils/cacheUtils');

/**
 * Middleware para verificar que un tag existe por ID
 * @returns {Function} - Middleware function
 */
const existTagModelById = () => {
  return async (req, res, next) => {
    const tagId = req.params.tagId;

    try {
      const data = await Tag.findById(tagId);
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

// Middleware para eliminar tag con invalidación de caché
const deleteTagWithCache = async (req, res, next) => {
  try {
    const tagId = req.params.id;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }

    // Buscar posts que usan este tag
    const postsWithTag = await Post.find({ tags: tagId });
    const postIds = postsWithTag.map(post => post._id.toString());

    // Eliminar el tag
    await Tag.findByIdAndDelete(tagId);

    // Remover el tag de todos los posts que lo usan
    await Post.updateMany(
      { tags: tagId },
      { $pull: { tags: tagId } }
    );

    // Invalidar cachés de posts que usaban este tag
    for (const postId of postIds) {
      await invalidatePostCache(postId);
    }
    await Promise.all([
      invalidatePostsListCache(),
      invalidateCommentsCache()
    ]);

    req.deletedTag = tag;
    next();
  } catch (error) {
    console.error('Error en eliminación del tag:', error);
    return res.status(500).json({ error: 'Error al eliminar el tag' });
  }
};

// Middleware para actualizar tag con invalidación de caché
const updateTagWithCache = async (req, res, next) => {
  try {
    const tagId = req.params.id;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }

    // Buscar posts que usan este tag
    const postsWithTag = await Post.find({ tags: tagId });
    const postIds = postsWithTag.map(post => post._id.toString());

    // Actualizar el tag
    const updatedTag = await Tag.findByIdAndUpdate(tagId, req.body, { new: true });

    // Invalidar cachés de posts que usan este tag
    for (const postId of postIds) {
      await invalidatePostCache(postId);
    }
    await Promise.all([
      invalidatePostsListCache(),
      invalidateCommentsCache()
    ]);

    req.updatedTag = updatedTag;
    next();
  } catch (error) {
    console.error('Error en actualización del tag:', error);
    return res.status(500).json({ error: 'Error al actualizar el tag' });
  }
};

module.exports = {
  existTagByName,
  existTagInPost,
  existTagModelById,
  deleteTagWithCache,
  updateTagWithCache
};
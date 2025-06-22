const mongoose = require('mongoose');
const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Tag = require('../db/models/tag');
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const { redisClient, CACHE_TTL } = require('../db/config/redisClient');
const { clearPostCache, invalidatePostCache, invalidatePostsListCache } = require('../utils/cacheUtils');

const getPostWithPopulatedData = async (postId) => {
  const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

  const post = await Post.findById(postId);

  if (!post) {
    return null;
  }

  const comments = await Comment.find({
    postId: postId,
    createdAt: { $gte: cutoffDate }
  });

  const tags = await Tag.find({ _id: { $in: post.tags } }).select('name');
  const postImages = await PostImage.find({ postId: postId }).select('url');

  const result = {
    ...post.toObject(),
    tags: tags,
    postImages: postImages,
    comments: comments
  };

  return result;
};

const getPostsWithPopulatedData = async () => {
  const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

  return await Post.find()
    .populate('tags', 'name')
    .populate('postImages', 'url')
    .populate({
      path: 'comments',
      match: { createdAt: { $gte: cutoffDate } }
    })
    .sort({ createdAt: -1 });
};

const getAllPosts = async (req, res) => {
  try {
    const cacheKey = 'posts:todos';

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const posts = await getPostsWithPopulatedData();

    await redisClient.set(cacheKey, JSON.stringify(posts), { EX: CACHE_TTL.POSTS });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Obtener post por ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const cacheKey = `post:${postId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const post = await getPostWithPopulatedData(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    await redisClient.set(cacheKey, JSON.stringify(post), { EX: CACHE_TTL.POSTS });
    res.status(200).json(post);
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//POST - Crear post
const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    // Invalidar caché de lista de posts
    await invalidatePostsListCache();

    const populatedPost = await getPostWithPopulatedData(post._id);

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//PUT - Actualizar post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    // Invalidar cachés
    await Promise.all([
      invalidatePostCache(postId),
      invalidatePostsListCache()
    ]);

    const populatedPost = await getPostWithPopulatedData(updatedPost._id);

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//DELETE - Eliminar post
const deletePost = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Post eliminado exitosamente',
      post: req.postToDelete
    });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Obtener tags de un post
const getPostTags = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags', 'name');

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.status(200).json(post.tags);
  } catch (error) {
    console.error('Error al obtener tags del post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//POST - Agregar tag a un post
const addTagToPost = async (req, res) => {
  try {
    const { id: postId, tagId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }

    if (post.tags.includes(tagId)) {
      return res.status(400).json({ error: 'El tag ya está asociado al post' });
    }

    post.tags.push(tagId);
    await post.save();

    // Invalidar cachés
    await Promise.all([
      invalidatePostCache(postId),
      invalidatePostsListCache()
    ]);

    const populatedPost = await getPostWithPopulatedData(post._id);

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Error al agregar tag al post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//DELETE - Remover tag de un post
const removeTagFromPost = async (req, res) => {
  try {
    const { id: postId, tagId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const tagIndex = post.tags.indexOf(tagId);
    if (tagIndex === -1) {
      return res.status(404).json({ error: 'El tag no está asociado al post' });
    }

    post.tags.splice(tagIndex, 1);
    await post.save();

    // Invalidar cachés
    await Promise.all([
      invalidatePostCache(postId),
      invalidatePostsListCache()
    ]);

    const populatedPost = await getPostWithPopulatedData(post._id);

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Error al remover tag del post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostTags,
  addTagToPost,
  removeTagFromPost
};
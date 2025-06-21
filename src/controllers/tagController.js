const Tag = require('../db/models/tag');
const { redisClient } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con tags
const invalidateTagCaches = async (tagId = null) => {
  if (tagId) {
    await redisClient.del(`tag:${tagId}`);
    await redisClient.del(`tag:${tagId}:posts`);
  }
  await redisClient.del('tags:todos');
  await redisClient.del('posts:todos');
};

module.exports = {
  // Crear un nuevo tag
  createTag: async (req, res) => {
    try {
      const { name } = req.body;
      const newTag = await Tag.create({ name: name.toLowerCase() });

      await invalidateTagCaches();

      res.status(201).json({
        message: "Tag creado exitosamente",
        tag: newTag
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.name) {
        return res.status(400).json({ error: `Ya existe un tag con el nombre ${name}` });
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el tag' });
    }
  },

  // Obtener todos los tags
  getAllTags: async (req, res) => {
    const cacheKey = 'tags:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Respuesta desde Redis');
        const tags = JSON.parse(cached);
        return tags.length === 0 ? res.status(204).send() : res.status(200).json(tags);
      }

      const tags = await Tag.find({}, 'id name').lean();

      if (tags.length === 0) {
        return res.status(204).json({ message: 'No hay tags disponibles' });
      }

      await redisClient.set(cacheKey, JSON.stringify(tags), { EX: 300 });
      res.status(200).json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener un tag específico
  getTagById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `tag:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Tag desde Redis');
        return res.status(200).json(JSON.parse(cached));
      }

      const tag = await Tag.findById(id).lean();

      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(tag), { EX: 300 });
      res.status(200).json(tag);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo obtener el tag' });
    }
  },

  // Actualizar un tag
  updateTag: async (req, res) => {
    try {
      const { name } = req.body;
      const tagId = req.params.id;

      const updatedTag = await Tag.findByIdAndUpdate(
        tagId,
        { $set: { name: name ? name.toLowerCase() : undefined } },
        { new: true, runValidators: true }
      );

      if (!updatedTag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      await invalidateTagCaches(tagId);

      res.status(200).json({
        message: "Tag actualizado exitosamente",
        tag: updatedTag
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.name) {
        return res.status(400).json({ error: 'El nombre del tag ya existe' });
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo actualizar el tag' });
    }
  },

  // Eliminar un tag completamente
  deleteTag: async (req, res) => {
    try {
      const tagId = req.params.id;
      const tag = await Tag.findById(tagId);

      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      // Remover relaciones con posts antes de eliminar el tag
      const Post = require('../db/models/post');
      await Post.updateMany(
        { tags: tagId },
        { $pull: { tags: tagId } }
      );

      // Eliminar el tag de la base de datos
      await Tag.findByIdAndDelete(tagId);

      await invalidateTagCaches(tagId);

      res.status(200).json({
        message: "Tag eliminado exitosamente",
        deletedTag: tag
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el tag' });
    }
  }
};

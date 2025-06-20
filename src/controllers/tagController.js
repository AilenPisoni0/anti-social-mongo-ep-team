
const Tag = require('../db/models/tag');
const Post = require('../db/models/post');
const { redisClient } = require('../db/config/redisClient');

module.exports = {
  // Crear un nuevo tag
  createTag: async (req, res) => {
    try {
      const { name } = req.body;
      const newTag = await Tag.create({ name: name.toLowerCase() });

      await redisClient.del('tags:todos');

      res.status(201).json(newTag);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
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
        return res.status(200).json(JSON.parse(cached));
      }

      const tags = await Tag.find({}, 'id name').lean();

      if (tags.length === 0) {
        return res.status(204).json({ message: 'No hay tags disponibles' });
      }

      await redisClient.set(cacheKey, JSON.stringify(tags), { EX: 300 });

      res.status(200).json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los tags' });
    }
  },

  // Obtener un tag específico con sus posts
  getTagById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `tag:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Tag desde Redis');
        return res.status(200).json(JSON.parse(cached));
      }

      const tag = await Tag.findById(id)
        .populate({
          path: 'posts',
          populate: {
            path: 'userId',
            select: 'nickName'
          }
        })
        .lean();

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
        { $set: { name: name ? name.toLowerCase() : undefined, isEdited: true } },
        { new: true, runValidators: true }
      );

      if (!updatedTag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      await redisClient.del(`tag:${tagId}`);
      await redisClient.del('tags:todos');

      res.status(200).json(updatedTag);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
        return res.status(400).json({ error: 'El nombre del tag ya existe' });
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo actualizar el tag' });
    }
  },

  // Eliminar un tag
  deleteTag: async (req, res) => {
    try {
      const tagId = req.params.id;
      const tag = await Tag.findByIdAndDelete(tagId);

      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      await redisClient.del(`tag:${tagId}`);
      await redisClient.del('tags:todos');

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el tag' });
    }
  }
};

const { Tag, Post, User } = require('../db/models');

module.exports = {
  // Crear un nuevo tag
  createTag: async (req, res) => {
    try {
      const { name } = req.body;
      const newTag = await Tag.create({ name });
      res.status(201).json(newTag);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo crear el tag' });
    }
  },

  // Obtener todos los tags
  getAllTags: async (req, res) => {
    try {
      const tags = await Tag.findAll({
        attributes: ['id', 'name']
      });

      if (tags.length === 0) {
        return res.status(204).json({ message: 'No hay tags disponibles' });
      }

      res.status(200).json(tags);
    } catch (err) {
      res.status(500).json({ error: 'No se pudieron obtener los tags' });
    }
  },

  // Obtener un tag específico con sus posts
  getTagById: async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id, {
        include: [{
          model: Post,
          include: [{
            model: User,
            attributes: ['nickName']
          }]
        }]
      });

      res.status(200).json(tag);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo obtener el tag' });
    }
  },

  // Actualizar un tag
  updateTag: async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id)

      tag.isEdited = true;
      
      await tag.update(req.body);
      res.status(200).json(tag);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'El nombre del tag ya existe' });
      }
      res.status(500).json({ error: 'No se pudo actualizar el tag' });
    }
  },

  // Eliminar un tag
  deleteTag: async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id)
      await tag.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar el tag' });
    }
  }
};


const Tag = require('../db/models/tag'); // Importar Tag directamente

const Post = require('../db/models/post'); // Se usa para populate, así que lo importamos

module.exports = {
  // Crear un nuevo tag
  createTag: async (req, res) => {
    try {
      const { name } = req.body;
      const newTag = await Tag.create({ name: name.toLowerCase() });
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
    try {
      const tags = await Tag.find({}, 'id name');
      if (tags.length === 0) {
        return res.status(204).json({ message: 'No hay tags disponibles' });
      }

      res.status(200).json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los tags' });
    }
  },

  // Obtener un tag específico con sus posts
  getTagById: async (req, res) => {
    try {

      const tag = await Tag.findById(req.params.id)
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

      // Mongoose: findByIdAndUpdate o findById y luego .set().save()
      const updatedTag = await Tag.findByIdAndUpdate(
        tagId,
        { $set: { name: name ? name.toLowerCase() : undefined, isEdited: true } },
        { new: true, runValidators: true }
      );

      if (!updatedTag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      res.status(200).json(updatedTag);
    } catch (err) {
      // Manejo de error de duplicado para Mongoose (código 11000)
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

      const tag = await Tag.findByIdAndDelete(req.params.id);

      if (!tag) {
        return res.status(404).json({ error: 'Tag no encontrado' });
      }

      res.status(204).send();

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el tag' });
    }
  }
};

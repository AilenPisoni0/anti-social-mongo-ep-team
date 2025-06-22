const Tag = require('../db/models/tag');

//GET - Obtener todos los tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error al obtener tags:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Obtener tag por ID
const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error('Error al obtener tag:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//POST - Crear tag
const createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error al crear tag:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//PUT - Actualizar tag
const updateTag = async (req, res) => {
  try {
    // El middleware ya actualizó el tag e invalidó las cachés
    res.status(200).json({
      message: 'Tag actualizado exitosamente',
      tag: req.updatedTag
    });
  } catch (error) {
    console.error('Error al actualizar tag:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//DELETE - Eliminar tag
const deleteTag = async (req, res) => {
  try {
    // El middleware ya eliminó el tag e invalidó las cachés
    res.status(200).json({
      message: 'Tag eliminado exitosamente',
      tag: req.deletedTag
    });
  } catch (error) {
    console.error('Error al eliminar tag:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
};

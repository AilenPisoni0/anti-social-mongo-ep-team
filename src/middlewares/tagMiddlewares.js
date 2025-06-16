// src/middlewares/tagMiddlewares.js
const Tag = require("../db/models/tag"); // Importar Tag directamente
const Post = require("../db/models/post"); // Necesario para verificar tags en posts

const existTagModelById = (modelo) => { // 'modelo' debería ser Tag
  return async (req, res, next) => {
    const tagId = req.params.tagId;
    try {
      // Sequelize: modelo.findByPk -> Mongoose: modelo.findById
      const data = await modelo.findById(tagId);
      if (!data) {
        return res
          .status(404)
          .json({ message: `El tag id ${tagId} no se encuentra registrado` });
      }
      next();
    } catch (err) {
      console.error(err);
      // Si el ID del tag no es un ObjectId válido de Mongoose, puede lanzar un error de tipo
      if (err.name === 'CastError') {
         return res.status(400).json({ message: `ID de tag ${tagId} no es válido` });
      }
      res.status(500).json({ error: 'Error al verificar la existencia del tag por ID' });
    }
  };
}

const existTagByName = () => {
  return async (req, res, next) => {
    const { name } = req.body;
    console.log(name);
    if (name) {
      try {
        // Sequelize: Tag.findOne({ where: { name } }) -> Mongoose: Tag.findOne({ name })
        const tag = await Tag.findOne({ name: name.toLowerCase() }); // Busca por nombre en minúsculas
        if (tag) {
          return res.status(400).json({
            message: `Ya existe un tag con el nombre ${name}`
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al verificar la existencia del tag por nombre' });
      }
    }
    next();
  }
}

const existTagInPost = () => {
  return async (req, res, next) => {
    const { id: postId, tagId } = req.params; // id es postId, tagId es el _id del tag
    try {
      // Sequelize: PostTag.findOne -> Mongoose: Buscar el tagId en el array 'tags' del Post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado para verificar el tag' });
      }

      // Verifica si el tagId existe en el array 'tags' del post
      const tagExistsInPost = post.tags.some(tag => tag.toString() === tagId);

      if (!tagExistsInPost) {
        return res.status(404).json({ error: 'Tag no encontrado en este post' });
      }
      next();
    } catch (err) {
      console.error(err);
       if (err.name === 'CastError') {
         return res.status(400).json({ message: `ID de post ${postId} o ID de tag ${tagId} no es válido` });
      }
      res.status(500).json({ error: 'Error al verificar si el tag está en el post' });
    }
  }
}

module.exports = {
  existTagByName,
  existTagInPost,
  existTagModelById
};
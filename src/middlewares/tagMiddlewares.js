const { Tag } = require("../db/models")
const { PostTag } = require("../db/models")

const existTagModelById = (modelo) => {
  return async (req, res, next) => {
    const tagId = req.params.tagId;
    const data = await modelo.findByPk(tagId);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El tag id ${tagId} no se encuentra registrado` });
    }
    next();
  };
}

const existTagByName = () => {
    return async (req, res, next) => {
        const { name } = req.body;
        console.log(name);
        if (name) {
            const tag = await Tag.findOne({ where: { name } });
            if (tag) {
                return res.status(400).json({
                    message: `Ya existe un tag con el nombre ${name}`
                });
            }
        }
        next();
    }
}

const existTagInPost = () => {
    return async (req, res, next) => {
        const { id, tagId } = req.params;
        const association = await PostTag.findOne({
            where: { postId: id, tagId }
        });
        if (!association) {
            return res.status(404).json({ error: 'Tag no encontrado en este post' });
        }
        next();
    }
}

module.exports = {
    existTagByName,
    existTagInPost,
    existTagModelById
}; 
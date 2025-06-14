const Joi = require("joi");

const PostTagSchema = Joi.object({
  postId: Joi.number().integer().required().messages({
    "any.required": "El ID del post es obligatorio",
    "number.base": "postId debe ser un número entero"
  }),
  tagId: Joi.number().integer().required().messages({
    "any.required": "El ID del tag es obligatorio",
    "number.base": "tagId debe ser un número entero"
  })
});

module.exports = { PostTagSchema };
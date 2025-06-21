const Joi = require("joi");

const CommentSchema = Joi.object({
  postId: Joi.string().length(24).hex().required().messages({
    "any.required": "El ID del post es obligatorio",
    "string.length": "El ID del post debe tener 24 caracteres",
    "string.hex": "El ID del post debe ser un hexadecimal válido"
  }),
  userId: Joi.string().length(24).hex().required().messages({
    "any.required": "El ID del usuario es obligatorio",
    "string.length": "El ID del usuario debe tener 24 caracteres",
    "string.hex": "El ID del usuario debe ser un hexadecimal válido"
  }),
  content: Joi.string().required().min(1).max(500).messages({
    "any.required": "Debes escribir algo en el comentario",
    "string.min": "El comentario debe tener como mínimo {#limit} carácter",
    "string.max": "El comentario no puede superar los {#limit} caracteres"
  })
});

const CommentUpdateSchema = Joi.object({
  content: Joi.string().required().min(1).max(500).messages({
    "any.required": "Debes escribir algo en el comentario",
    "string.min": "El comentario debe tener como mínimo {#limit} carácter",
    "string.max": "El comentario no puede superar los {#limit} caracteres"
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "La fecha de creación debe ser una fecha válida"
  })
});

module.exports = { CommentSchema, CommentUpdateSchema };
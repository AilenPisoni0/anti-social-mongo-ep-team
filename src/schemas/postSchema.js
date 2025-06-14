const Joi = require('joi');

// Crear un nuevo post
const createPostSchema = Joi.object({
  description: Joi.string().min(1).max(2000).required().messages({
    "any.required": "La descripción del post es obligatoria",
    "string.min": "La descripción del post debe tener al menos {#limit} carácter",
    "string.max": "La descripción del post no puede superar los {#limit} caracteres"
  }),
  userId: Joi.number().integer().min(1).required().messages({
    "any.required": "El ID del usuario es obligatorio",
    "number.min": "El ID del usuario debe ser un número positivo"
  }),
  tags: Joi.array().items(
    Joi.number().integer().min(1)
  ).optional().messages({
    "array.base": "Los tags deben proporcionarse como un array",
    "number.min": "Los IDs de los tags deben ser números positivos"
  })
});

// Actualizar un post
const updatePostSchema = Joi.object({
  description: Joi.string().min(1).max(2000).optional().messages({
    "string.min": "La descripción del post debe tener al menos {#limit} carácter",
    "string.max": "La descripción del post no puede superar los {#limit} caracteres",
  }),
  userId: Joi.number().integer().min(1).optional().messages({
    "any.required": "El ID del usuario es obligatorio",
    "number.min": "El ID del usuario debe ser un número positivo"
  }),
  isEdited: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional()
}).or('description', 'userId');;

module.exports = {
  createPostSchema,
  updatePostSchema
};
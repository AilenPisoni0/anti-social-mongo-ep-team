const Joi = require('joi');

// Crear un nuevo post
const createPostSchema = Joi.object({
  description: Joi.string().min(1).max(2000).required().messages({
    "any.required": "La descripción del post es obligatoria",
    "string.min": "La descripción del post debe tener al menos {#limit} carácter",
    "string.max": "La descripción del post no puede superar los {#limit} caracteres"
  }),
  userId: Joi.string().length(24).hex().required().messages({
    "any.required": "El ID del usuario es obligatorio",
    "string.length": "El ID del usuario debe tener 24 caracteres",
    "string.hex": "El ID del usuario debe ser un hexadecimal válido"
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
  userId: Joi.string().length(24).hex().required().messages({
    "any.required": "El ID del usuario es obligatorio",
    "string.length": "El ID del usuario debe tener 24 caracteres",
    "string.hex": "El ID del usuario debe ser un hexadecimal válido"
  }),
  isEdited: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional()
}).or('description', 'userId');;

module.exports = {
  createPostSchema,
  updatePostSchema
};
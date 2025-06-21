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
    Joi.string().length(24).hex()
  ).optional().messages({
    "array.base": "Los tags deben proporcionarse como un array",
    "string.length": "El ID de cada tag debe tener 24 caracteres",
    "string.hex": "El ID de cada tag debe ser un hexadecimal válido"
  }),
  imagenes: Joi.array().items(
    Joi.string().uri()
  ).max(5).optional().messages({
    "array.base": "Las imágenes deben proporcionarse como un array de URLs",
    "array.max": "No se pueden subir más de {#limit} imágenes",
    "string.uri": "Cada imagen debe ser una URL válida"
  })
});

// Actualizar un post
const updatePostSchema = Joi.object({
  description: Joi.string().min(1).max(2000).optional().messages({
    "string.min": "La descripción del post debe tener al menos {#limit} carácter",
    "string.max": "La descripción del post no puede superar los {#limit} caracteres"
  }),
  userId: Joi.string().length(24).hex().optional().messages({
    "string.length": "El ID del usuario debe tener 24 caracteres",
    "string.hex": "El ID del usuario debe ser un hexadecimal válido"
  }),
  tags: Joi.array().items(
    Joi.string().length(24).hex()
  ).optional().messages({
    "array.base": "Los tags deben proporcionarse como un array",
    "string.length": "El ID de cada tag debe tener 24 caracteres",
    "string.hex": "El ID de cada tag debe ser un hexadecimal válido"
  }),
  imagenes: Joi.array().items(
    Joi.string().uri()
  ).max(5).optional().messages({
    "array.base": "Las imágenes deben proporcionarse como un array de URLs",
    "array.max": "No se pueden subir más de {#limit} imágenes",
    "string.uri": "Cada imagen debe ser una URL válida"
  })
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema
};
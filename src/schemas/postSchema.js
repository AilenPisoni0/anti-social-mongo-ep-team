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
    Joi.string().length(24).hex() // <--- ¡CORREGIDO! Los tags son ObjectIDs
  ).optional().messages({
    "array.base": "Los tags deben proporcionarse como un array",
    "string.length": "El ID de cada tag debe tener 24 caracteres",
    "string.hex": "El ID de cada tag debe ser un hexadecimal válido"
  }),
  // Si permites enviar imágenes en la creación del post, podrías añadir algo como esto:
  images: Joi.array().items(
    Joi.string().uri() // Asumiendo que inicialmente solo envías las URLs
  ).optional().messages({
    "array.base": "Las imágenes deben proporcionarse como un array de URLs válidas",
    "string.uri": "Cada elemento en el array de imágenes debe ser una URL válida"
  })
});

// Actualizar un post
const updatePostSchema = Joi.object({
  description: Joi.string().min(1).max(2000).optional().messages({
    "string.min": "La descripción del post debe tener al menos {#limit} carácter",
    "string.max": "La descripción del post no puede superar los {#limit} caracteres",
  }),
  userId: Joi.string().length(24).hex().optional().messages({ // <--- ¡RECOMENDACIÓN: CAMBIAR A OPTIONAL!
    "string.length": "El ID del usuario debe tener 24 caracteres",
    "string.hex": "El ID del usuario debe ser un hexadecimal válido"
  }),
  // Si permites actualizar o reestructurar imágenes directamente en la actualización del post:
  images: Joi.array().items(
    Joi.object({
      _id: Joi.string().length(24).hex().optional(), // El ID del subdocumento de imagen
      postImageURL: Joi.string().uri().required(),
      isEdited: Joi.boolean().optional(),
      isDeleted: Joi.boolean().optional()
    })
  ).optional().messages({
    "array.base": "Las imágenes deben proporcionarse como un array",
  }),
  tags: Joi.array().items(
    Joi.string().length(24).hex() // <--- ¡CORREGIDO! Los tags son ObjectIDs
  ).optional().messages({
    "array.base": "Los tags deben proporcionarse como un array",
    "string.length": "El ID de cada tag debe tener 24 caracteres",
    "string.hex": "El ID de cada tag debe ser un hexadecimal válido"
  }),
  isEdited: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional()
}).min(1); // <--- ¡RECOMENDACIÓN: USAR .min(1) EN LUGAR DE .or()! Esto asegura que al menos un campo actualizable esté presente.

module.exports = {
  createPostSchema,
  updatePostSchema
};
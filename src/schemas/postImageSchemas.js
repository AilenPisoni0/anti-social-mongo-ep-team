const Joi = require('joi');

const createPostImageSchema = Joi.object({
    postId: Joi.string().length(24).hex().required().messages({ //
    "any.required": "El ID del post es obligatorio",
    "number.min": "El ID del post debe ser un número positivo"
  }),
  postImageURL: Joi.string().uri().required().messages({
    "any.required": "La URL de la imagen es obligatoria",
    "string.uri": "La URL de la imagen debe ser una dirección web válida"
  })
});

const updatePostImageSchema = Joi.object({
  postImageURL: Joi.string().uri().optional().messages({
    "string.uri": "La URL de la imagen debe ser una dirección web válida"
  }),
  isEdited: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional()
});

module.exports = {
  createPostImageSchema,
  updatePostImageSchema
};
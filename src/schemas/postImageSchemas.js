const Joi = require('joi');

const createPostImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    "any.required": "La URL de la imagen es obligatoria",
    "string.uri": "La URL de la imagen debe ser una dirección web válida"
  })
});

const updatePostImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    "any.required": "La URL de la imagen es obligatoria",
    "string.uri": "La URL de la imagen debe ser una dirección web válida"
  })
});

module.exports = {
  createPostImageSchema,
  updatePostImageSchema
};
const Joi = require("joi");

const PostTagSchema = Joi.object({
    postId: Joi.string().length(24).hex().required().messages({
        "any.required": "El ID del post es obligatorio",
        "string.length": "El ID del post debe tener 24 caracteres",
        "string.hex": "El ID del post debe ser un hexadecimal válido"
    }),
    tagId: Joi.string().length(24).hex().required().messages({
        "any.required": "El ID del tag es obligatorio",
        "string.length": "El ID del tag debe tener 24 caracteres",
        "string.hex": "El ID del tag debe ser un hexadecimal válido"
    })
});

module.exports = { PostTagSchema };
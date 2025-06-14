const Joi = require("joi");

const CommentSchema = Joi.object({
    postId: Joi.number().required().min(1).messages({
        "any.required": "El ID del post es obligatorio",
        "number.min": "El ID del post debe ser un número positivo"
    }),
    userId: Joi.number().required().min(1).messages({
        "any.required": "El ID del usuario es obligatorio",
        "number.min": "El ID del usuario debe ser un número positivo"
    }),
    content: Joi.string().required().min(1).max(280)
        .pattern(/^.*$/).messages({
            "any.required": "Debes escribir algo en el comentario",
            "string.min": "El comentario debe tener como mínimo {#limit} carácter",
            "string.max": "El comentario no puede superar los {#limit} caracteres",
        })
});

const CommentUpdateSchema = Joi.object({
    content: Joi.string().required().min(1).max(280).messages({
        "any.required": "Debes escribir algo en el comentario",
        "string.min": "El comentario debe tener como mínimo {#limit} carácter",
        "string.max": "El comentario no puede superar los {#limit} caracteres",
    })
});

module.exports = { CommentSchema, CommentUpdateSchema };
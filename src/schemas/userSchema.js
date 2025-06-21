const Joi = require("joi");

const UserSchema = Joi.object({
    nickName: Joi.string().required().min(4).max(12).pattern(/^[a-zA-Z0-9_]+$/).messages({
        "any.required": "nickName es obligatorio",
        "string.min": "nickName debe tener como mínimo {#limit} carácteres",
        "string.max": "nickName debe tener como máximo {#limit} carácteres",
        "string.empty": "nickName no puede estar vacío",
        "string.pattern.base": "El nickName solo puede contener letras, números y guiones bajos"
    }),

    email: Joi.string().required().email().messages({
        "any.required": "email es obligatorio",
        "string.empty": "email no puede estar vacío",
        "string.email": "El formato del email no es válido"
    })
});

const UpdateUserSchema = Joi.object({
    nickName: Joi.string()
        .min(4)
        .max(12)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            "string.min": "El nickName debe tener como mínimo {#limit} caracteres",
            "string.max": "El nickName debe tener como máximo {#limit} caracteres",
            "string.empty": "El nickName no puede estar vacío",
            "string.pattern.base": "El nickName solo puede contener letras, números y guiones bajos"
        }),
    email: Joi.string()
        .email()
        .messages({
            "string.empty": "El email no puede estar vacío",
            "string.email": "El formato del email no es válido"
        }),
    isEdited: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional()
});

module.exports = { UserSchema, UpdateUserSchema };
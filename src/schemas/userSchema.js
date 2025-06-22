const Joi = require("joi");

const UserSchema = Joi.object({
    nickName: Joi.string().required().min(4).max(30).pattern(/^[a-zA-Z0-9_]+$/).messages({
        "any.required": "El nickName es obligatorio",
        "string.min": "El nickName debe tener como mínimo {#limit} caracteres",
        "string.max": "El nickName debe tener como máximo {#limit} caracteres",
        "string.empty": "El nickName no puede estar vacío",
        "string.pattern.base": "El nickName solo puede contener letras, números y guiones bajos"
    }),

    email: Joi.string().required().email().max(254).messages({
        "any.required": "El email es obligatorio",
        "string.empty": "El email no puede estar vacío",
        "string.email": "El formato del email no es válido",
        "string.max": "El email no puede superar los {#limit} caracteres"
    })
});

const UpdateUserSchema = Joi.object({
    nickName: Joi.string()
        .min(4)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            "string.min": "El nickName debe tener como mínimo {#limit} caracteres",
            "string.max": "El nickName debe tener como máximo {#limit} caracteres",
            "string.empty": "El nickName no puede estar vacío",
            "string.pattern.base": "El nickName solo puede contener letras, números y guiones bajos"
        }),
    email: Joi.string()
        .email()
        .max(254)
        .messages({
            "string.empty": "El email no puede estar vacío",
            "string.email": "El formato del email no es válido",
            "string.max": "El email no puede superar los {#limit} caracteres"
        })
});

module.exports = { UserSchema, UpdateUserSchema };
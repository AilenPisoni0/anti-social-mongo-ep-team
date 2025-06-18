const Joi = require("joi");

const UserSchema = Joi.object({
    nickName: Joi.string().required().min(4).max(12).pattern(/^[a-zA-Z0-9_]+$/).messages({
            "any.required": "nickName es obligatorio",
            "string.min": "nickName debe tener como mínimo {#limit} carácteres",
            "string.max": "nickName debe tener como máximo {#limit} carácteres",
            "string.empty": "nicknName no puede estar vacío",
            "string.pattern.base": "El nickName solo puede contener letras, números y guiones bajos"
        }),

    email: Joi.string().required().email().messages({
        "any.required": "email es obligatorio",
        "string.empty": "email no puede estar vacío",
        "string.email": "El formato del email no es válido"
    }),

    // ¡¡¡AGREGA ESTO!!!
    password: Joi.string().required().min(8).max(30).messages({ // Ajusta min/max según tus requisitos
        "any.required": "La contraseña es obligatoria",
        "string.empty": "La contraseña no puede estar vacía",
        "string.min": "La contraseña debe tener como mínimo {#limit} caracteres",
        "string.max": "La contraseña debe tener como máximo {#limit} caracteres"
    })
    // Puedes agregar más validaciones aquí, como pattern para caracteres especiales, etc.
});

const UpdateUserSchema = Joi.object({
    // ... (el resto de tu esquema UpdateUserSchema, déjalo como está)
});

module.exports = { UserSchema, UpdateUserSchema };
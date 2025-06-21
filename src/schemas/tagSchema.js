const Joi = require("joi");

const TagSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]+$/)
        .messages({
            "any.required": "El nombre del tag es obligatorio",
            "string.min": "El nombre del tag debe tener al menos {#limit} caracteres",
            "string.max": "El nombre del tag no puede tener más de {#limit} caracteres",
            "string.empty": "El nombre del tag no puede estar vacío",
            "string.pattern.base": "El nombre del tag solo puede contener letras, números, espacios, guiones y guiones bajos"
        })
});

const UpdateTagSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]+$/)
        .messages({
            "any.required": "El nombre del tag es obligatorio",
            "string.min": "El nombre del tag debe tener al menos {#limit} caracteres",
            "string.max": "El nombre del tag no puede tener más de {#limit} caracteres",
            "string.empty": "El nombre del tag no puede estar vacío",
            "string.pattern.base": "El nombre del tag solo puede contener letras, números, espacios, guiones y guiones bajos"
        }),
    isDeleted: Joi.boolean().optional(),
    isEdited: Joi.boolean().optional()
});

module.exports = {
    TagSchema,
    UpdateTagSchema
};
const mongoose = require('mongoose');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 * @param {string} id - El ID a validar
 * @returns {boolean} - true si es válido, false si no
 */
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Valida un esquema Joi y retorna errores formateados
 * @param {Object} schema - Esquema Joi a validar
 * @param {Object} data - Datos a validar
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
const validateSchema = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));
        return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
};

/**
 * Formatea un mensaje de error estándar
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @returns {Object} - Objeto de error formateado
 */
const formatError = (message, statusCode = 400) => {
    return {
        statusCode,
        error: message
    };
};

/**
 * Maneja errores de MongoDB (CastError, etc.)
 * @param {Error} error - Error de MongoDB
 * @param {string} entityName - Nombre de la entidad (ej: "usuario", "post")
 * @returns {Object} - Objeto de error formateado
 */
const handleMongoError = (error, entityName = 'entidad') => {
    if (error.name === 'CastError') {
        return formatError(`ID de ${entityName} no es válido`, 400);
    }

    console.error(`Error en ${entityName}:`, error);
    return formatError(`Error interno del servidor`, 500);
};

module.exports = {
    isValidObjectId,
    validateSchema,
    formatError,
    handleMongoError
}; 
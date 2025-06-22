const { validateSchema } = require('../utils/validation');
const { validateId, validateEntityExists } = require('../utils/entityValidation');

/**
 * Middleware para validar esquemas Joi
 * @param {Object} schema - Esquema Joi a validar
 * @returns {Function} - Middleware function
 */
const schemaValidator = (schema) => {
    return (req, res, next) => {
        const { isValid, errors } = validateSchema(schema, req.body);
        if (!isValid) {
            return res.status(400).json({ errors });
        }
        next();
    };
};

// Exportar funciones específicas usando las utilidades
const validateMongoId = validateId('id');
const validatePostId = validateId('postId');
const validateUserId = validateId('userId');
const validateTagId = validateId('tagId');

// Factory functions para validación de existencia
const createEntityExistsValidator = (Model, entityName) => {
    return validateEntityExists(Model, entityName, 'id');
};

const createUserExistsValidator = () => {
    const User = require('../db/models/user');
    return validateEntityExists(User, 'Usuario', 'userId');
};

const createPostExistsValidator = () => {
    const Post = require('../db/models/post');
    return validateEntityExists(Post, 'Post', 'postId');
};

module.exports = {
    schemaValidator,
    validateMongoId,
    validatePostId,
    validateUserId,
    validateTagId,
    createEntityExistsValidator,
    createUserExistsValidator,
    createPostExistsValidator
}; 
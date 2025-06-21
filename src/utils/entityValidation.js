const { isValidObjectId, formatError, handleMongoError } = require('./validation');

/**
 * Middleware factory para validar que un ID es válido
 * @param {string} paramName - Nombre del parámetro a validar (ej: 'id', 'postId')
 * @returns {Function} - Middleware function
 */
const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName] || req.body[paramName];

        if (!id) {
            return res.status(400).json(formatError(`Se requiere el ${paramName}`));
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json(formatError(`El ${paramName} ${id} no es válido`));
        }

        next();
    };
};

/**
 * Middleware factory para verificar que una entidad existe por ID
 * @param {Object} Model - Modelo de Mongoose
 * @param {string} entityName - Nombre de la entidad para mensajes de error
 * @param {string} paramName - Nombre del parámetro a buscar
 * @param {boolean} attachToReq - Si se debe adjuntar la entidad a req
 * @returns {Function} - Middleware function
 */
const validateEntityExists = (Model, entityName, paramName = 'id', attachToReq = false) => {
    return async (req, res, next) => {
        try {
            const id = req.params[paramName] || req.body[paramName];
            if (!id) {
                return res.status(400).json(formatError(`Se requiere el ${paramName}`));
            }
            const entity = await Model.findById(id);
            if (!entity) {
                return res.status(404).json(formatError(`${entityName} no encontrado`, 404));
            }
            if (attachToReq) {
                req[entityName.toLowerCase()] = entity;
            }
            next();
        } catch (error) {
            const errorResponse = handleMongoError(error, entityName);
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
    };
};

/**
 * Middleware factory para verificar que no existe una entidad con un atributo específico
 * @param {Object} Model - Modelo de Mongoose
 * @param {string} attribute - Atributo a verificar
 * @param {string} entityName - Nombre de la entidad para mensajes de error
 * @param {string} excludeIdParam - Parámetro del ID a excluir (para updates)
 * @returns {Function} - Middleware function
 */
const validateUniqueAttribute = (Model, attribute, entityName, excludeIdParam = null) => {
    return async (req, res, next) => {
        try {
            const value = req.body[attribute];

            if (!value) {
                return next(); // Si no hay valor, no hay conflicto
            }

            let query = { [attribute]: value };

            // Para updates, excluir la entidad actual
            if (excludeIdParam) {
                const excludeId = req.params[excludeIdParam];
                if (excludeId) {
                    query._id = { $ne: excludeId };
                }
            }

            const existingEntity = await Model.findOne(query);
            if (existingEntity) {
                return res.status(400).json(formatError(`Ya existe un ${entityName} con ${attribute} ${value}`));
            }

            next();
        } catch (error) {
            const errorResponse = handleMongoError(error, entityName);
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
    };
};

module.exports = {
    validateId,
    validateEntityExists,
    validateUniqueAttribute
}; 
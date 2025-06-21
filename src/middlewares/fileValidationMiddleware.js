const { validateImageFiles: validateFiles, validateRequiredFields: validateFields } = require('../utils/fileValidation');

/**
 * Middleware para validar archivos de imagen
 * @returns {Function} - Middleware function
 */
const validateImageFiles = (req, res, next) => {
    const { isValid, error } = validateFiles(req.body.imagenes);

    if (!isValid) {
        return res.status(415).json({ error });
    }

    next();
};

/**
 * Middleware para validar campos obligatorios
 * @returns {Function} - Middleware function
 */
const validateRequiredFields = (req, res, next) => {
    const { isValid, error } = validateFields(req.body, ['userId', 'description']);

    if (!isValid) {
        return res.status(400).json({ error });
    }

    next();
};

module.exports = {
    validateImageFiles,
    validateRequiredFields
}; 
/**
 * Valida extensiones de archivo permitidas
 * @param {string} filename - Nombre del archivo
 * @param {Array} allowedExtensions - Array de extensiones permitidas
 * @returns {boolean} - true si la extensión es válida
 */
const validateFileExtension = (filename, allowedExtensions) => {
    const fileExtension = filename.toLowerCase().split('.').pop();
    return allowedExtensions.includes(`.${fileExtension}`);
};

/**
 * Valida múltiples archivos de imagen
 * @param {Array} files - Array de nombres de archivos
 * @param {number} maxFiles - Número máximo de archivos permitidos
 * @param {Array} allowedExtensions - Extensiones permitidas
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateImageFiles = (files, maxFiles = 5, allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']) => {
    if (!files || files.length === 0) {
        return { isValid: true };
    }

    if (files.length > maxFiles) {
        return {
            isValid: false,
            error: `Demasiadas imágenes. Máximo ${maxFiles} imágenes permitidas.`
        };
    }

    for (const file of files) {
        if (typeof file !== 'string' || !file.trim()) {
            return {
                isValid: false,
                error: 'Tipo de archivo no permitido (solo se permiten imágenes)'
            };
        }

        if (!validateFileExtension(file, allowedExtensions)) {
            return {
                isValid: false,
                error: 'Tipo de archivo no permitido (solo se permiten imágenes)'
            };
        }
    }

    return { isValid: true };
};

/**
 * Valida campos obligatorios en el body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array de campos obligatorios
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateRequiredFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
            return {
                isValid: false,
                error: `El campo "${field}" es obligatorio`
            };
        }
    }

    return { isValid: true };
};

module.exports = {
    validateFileExtension,
    validateImageFiles,
    validateRequiredFields
}; 
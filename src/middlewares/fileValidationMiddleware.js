// Middleware para validar archivos de imagen
const validateImageFiles = (req, res, next) => {
    const imagenes = req.body.imagenes;

    if (!imagenes || imagenes.length === 0) {
        return next();
    }

    if (imagenes.length > 5) {
        return res.status(413).json({
            error: 'Muchas imágenes. Máximo 5 imágenes permitidas.'
        });
    }

    for (let i = 0; i < imagenes.length; i++) {
        const imagen = imagenes[i];

        if (typeof imagen !== 'string' || !imagen.trim()) {
            return res.status(415).json({
                error: 'Tipo de archivo no permitido (solo se permiten imágenes)'
            });
        }

        // Validamos extensión de archivo
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const fileExtension = imagen.toLowerCase().split('.').pop();

        if (!allowedExtensions.includes(`.${fileExtension}`)) {
            return res.status(415).json({
                error: 'Tipo de archivo no permitido (solo se permiten imágenes)'
            });
        }
    }

    next();
};

// Middleware para validar campos obligatorios
const validateRequiredFields = (req, res, next) => {
    const { userId, description } = req.body;

    if (!userId || !description) {
        return res.status(400).json({
            error: 'Los campos "userId" y "description" son obligatorios'
        });
    }

    if (!description.trim()) {
        return res.status(400).json({
            error: 'Los campos "userId" y "description" son obligatorios'
        });
    }

    next();
};

module.exports = {
    validateImageFiles,
    validateRequiredFields
}; 
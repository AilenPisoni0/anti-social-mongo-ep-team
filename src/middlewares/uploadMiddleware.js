const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/images';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'imagen-' + uniqueSuffix + extension);
    }
});

// Filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y GIF.'), false);
    }
};

// Configurar multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
        files: 5 // Máximo 5 archivos
    }
});

// Middleware para manejar errores de multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: 'Archivo demasiado grande. Máximo 5MB por archivo.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({
                error: 'Demasiados archivos. Máximo 5 imágenes permitidas.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Campo de archivo inesperado.'
            });
        }
    }

    if (error.message.includes('Tipo de archivo no permitido')) {
        return res.status(415).json({
            error: error.message
        });
    }

    next(error);
};

module.exports = {
    upload,
    handleUploadError
}; 
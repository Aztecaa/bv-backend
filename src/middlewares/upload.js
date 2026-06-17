// bv-backend/src/middlewares/upload.js

import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({
    storage,

    // Límite de 5MB por archivo
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    // Solo acepta imágenes
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP)'))
        }
        cb(null, true)
    }
})

export default upload
// bv-backend/src/routes/upload.routes.js

import { Router } from 'express'
import streamifier from 'streamifier'
import multer from 'multer'
import upload from '../middlewares/upload.js'
import cloudinary from '../config/cloudinary.js'
import { isAdmin } from '../middlewares/auth.js'

const router = Router()

/* --------------------------
   Upload imágenes
   Protegido — solo supervisores
--------------------------- */
router.post(
    '/',
    isAdmin,
    upload.array('images', 10),

    async (req, res) => {
        try {
            const files = req.files

            if (!files || !files.length) {
                return res.status(400).json({ message: 'No se enviaron imágenes' })
            }

            const uploadedImages = []

            for (const file of files) {
                const result = await uploadToCloudinary(file)
                uploadedImages.push({ url: result.secure_url })
            }

            res.json(uploadedImages)

        } catch (error) {

            // Error de multer (tipo de archivo o tamaño)
            if (error instanceof multer.MulterError || error.message.includes('Solo se permiten')) {
                return res.status(400).json({ message: error.message })
            }

            console.error(error)
            res.status(500).json({ message: 'Error subiendo imágenes' })
        }
    }
)

/* --------------------------
   Helper — sube un archivo a Cloudinary
--------------------------- */
function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'bv-autos' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        streamifier.createReadStream(file.buffer).pipe(stream)
    })
}

export default router
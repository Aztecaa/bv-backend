// bv-backend/src/routes/upload.routes.js

import { Router } from 'express'
import streamifier from 'streamifier'
import multer from 'multer'
import upload from '../middlewares/upload.js'
import cloudinary from '../config/cloudinary.js'

const router = Router()

function buildFallbackImage(file) {
  const title = (file.originalname || 'Imagen').replace(/\.[^.]+$/, '')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#e7e5e4"/>
      <rect x="40" y="40" width="720" height="420" rx="24" fill="#f5f5f4" stroke="#d6d3d1" stroke-width="4"/>
      <circle cx="400" cy="240" r="90" fill="#a8a29e"/>
      <path d="M300 360h200" stroke="#78716c" stroke-width="16" stroke-linecap="round"/>
      <text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#44403c">${title}</text>
    </svg>`

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    source: 'local'
  }
}

/* --------------------------
   Upload imágenes
--------------------------- */
router.post('/', upload.array('images'), async (req, res) => {
  try {
    const files = req.files || []

    if (!files.length) {
      return res.json([{ url: getFallbackSvg(), source: 'local' }])
    }

    const uploadedImages = []

    for (const file of files) {
      try {
        console.log('[upload] Iniciando Cloudinary...', file.originalname)
        const result = await uploadToCloudinary(file)
        console.log('[upload] ✅ SUCCESS:', result.secure_url)
        uploadedImages.push({ url: result.secure_url, source: 'cloudinary' })
      } catch (error) {
        console.error('[upload] ❌ Cloudinary error:', error.message)
        uploadedImages.push(buildFallbackImage(file))
      }
    }

    res.json(uploadedImages)
  } catch (error) {
    console.error('Upload route error:', error)
    res.status(500).json({ message: 'Error en upload' })
  }
})

function getFallbackSvg() {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="%23e7e5e4"/><text x="400" y="250" text-anchor="middle" font-size="30" fill="%2344403c">Sin imagen</text></svg>`
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'bv-autos' },
      (error, result) => error ? reject(error) : resolve(result)
    )
    streamifier.createReadStream(file.buffer).pipe(stream)
  })
}

export default router
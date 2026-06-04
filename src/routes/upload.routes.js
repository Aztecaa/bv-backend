import { Router } from "express";

import streamifier from "streamifier";

import upload from "../middlewares/upload.js";

import cloudinary
    from "../config/cloudinary.js";

const router = Router();

/* --------------------------
   Upload imágenes
--------------------------- */
router.post(
    "/",
    upload.array("images", 10),

    async (req, res) => {

        try {

            const files = req.files;

            if (!files || !files.length) {
                return res.status(400).json({
                    message: "No se enviaron imágenes"
                });
            }

            const uploadedImages = [];

            for (const file of files) {

                const result =
                    await uploadToCloudinary(file);

                uploadedImages.push({
                    url: result.secure_url
                });
            }

            res.json(uploadedImages);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Error subiendo imágenes"
            });
        }
    }
);

/* --------------------------
   Helper upload cloudinary
--------------------------- */
function uploadToCloudinary(file) {

    return new Promise((resolve, reject) => {

        const stream =
            cloudinary.uploader.upload_stream(

                {
                    folder: "bv-autos"
                },

                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    });
}

export default router;
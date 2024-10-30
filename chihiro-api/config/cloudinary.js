// Configuración de Cloudinary para subir imágenes correctamente a Vercel.


const cloudinary = require('cloudinary').v2;
require('dotenv').config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Asegúrate de que CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET estén definidos en el archivo .env");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Conexión test
cloudinary.api.ping()
    .then(result => console.log("Conexión exitosa a Cloudinary:", result))
    .catch(err => console.error("Error al conectar a Cloudinary:", err));

// Exportación de Cloudinary

module.exports = cloudinary;

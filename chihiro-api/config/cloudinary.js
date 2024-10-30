const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Probar la conexión
cloudinary.api.ping()
    .then(result => console.log("Conexión exitosa a Cloudinary:", result))
    .catch(err => console.error("Error al conectar a Cloudinary:", err));

module.exports = cloudinary
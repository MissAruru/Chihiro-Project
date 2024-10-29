const cloudinary = require('cloudinary').v2;

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});
cloudinary.api.resources()
    .then(result => {
        console.log("Conexión exitosa a Cloudinary:", result);
    })
    .catch(err => {
        console.error("Error al conectar a Cloudinary:", err);
    });

module.exports = cloudinary
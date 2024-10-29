// Archivo router.js para configurar las rutas de Express:
require('dotenv').config(); 
const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary'); // Asegúrate de que esta ruta sea correcta
const { postLogin } = require('../controllers/login.controller');
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller');

const router = express.Router();

// Configuramos Multer con almacenamiento en memoria
const storage = multer.memoryStorage(); // Usamos almacenamiento en memoria
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB como máximo
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        cb(isValid ? null : new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'), isValid);
    }
});

// Ruta para subir archivos
router.post('/uploads', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
            stream.end(req.file.buffer); // Aquí estamos enviando el buffer de la imagen a Cloudinary
        });
        console.log('Resultado de Cloudinary:', result)
        // Aquí puedes guardar result.secure_url en la base de datos
        res.status(200).send({ message: 'Imagen subida a Cloudinary', file: result });
    } catch (error) {
        console.error('Error en la subida a Cloudinary:', error);
        res.status(500).send('Error al subir la imagen');
    }
});


// Ruta para login
router.post('/login', postLogin);

// Ruta principal GET /
router.get('/', (req, res) => {
    res.send('Haciendo / en GET');
});

// Ruta para obtener la imagen de un personaje
router.get('/personajes/:id/imagen', async (req, res) => {
    try {
        const personaje = await Personajes.findById(req.params.id);
        if (!personaje || !personaje.imagenUrl) {
            return res.status(404).send('Imagen no encontrada');
        }
        res.redirect(personaje.imagenUrl);
    } catch (error) {
        res.status(500).send('Error al obtener la imagen');
    }
});

// Rutas para personajes
router.route('/personajes')
    .get(getPersonaje)
    .post(upload.single('imagen'), postPersonaje);

// Rutas para PUT y DELETE
router.route('/personajes/:id')
    .put(upload.single('imagen'), putPersonaje)
    .delete(deletePersonaje);

// Middleware para manejar rutas no encontradas (404)
router.all('*', (req, res, next) => {
    const err = new Error('No encuentro el Endpoint');
    err.status = 404;
    next(err);
});

// Middleware para manejar errores internos
router.use((err, req, res, next) => {
    console.error(err); // Imprime el error completo en la consola
    const { status = 500, statusText = 'Error interno de mi API' } = err;
    res.status(status).json({ status, statusText });
});

// Exportamos el router
module.exports = { router };

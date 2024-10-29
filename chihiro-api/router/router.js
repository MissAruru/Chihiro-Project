// Archivo router.js para configurar las rutas de Express:



// Primero importamos las dependencias necesarias:

const express = require('express')
const multer = require('multer')
const path = require('path')
const { postLogin } = require('../controllers/login.controller')
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller')
const router = express.Router()

// Ahora configuramos el almacenamiento para Multer (subida de imagenes a la web)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ajusta la ruta donde deseas almacenar las imágenes
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); // Asigna un nombre único a cada archivo
    },
});


// Configuramos Multer con límites de tamaño y filtros de archivo
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB como máximo
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/
        const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        cb(isValid ? null : new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'), isValid)
    }
})

// Definimos la ruta para subir archivos (con almacenamiento en memoria)
router.post('/upload', upload.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    console.log('Archivo subido:', req.file);

    res.status(200).send({ message: 'Imagen subida en memoria', file: req.file });
});
// Creamos un router de Express


// Y definimos las rutas, en este caso la de login en post, para poder manejar el inicio de sesión

router.post('/login', postLogin)

// Ruta principal GET /
router.get('/', (req, res) => {
    res.send('Haciendo / en GET')
});

// router.js

router.get('/personajes/:id/imagen', async (req, res) => {
    try {
        const personaje = await Personajes.findById(req.params.id)
        if (!personaje || !personaje.imagenUrl) {
            return res.status(404).send('Imagen no encontrada')
        }
        res.redirect(personaje.imagenUrl)
    } catch (error) {
        res.status(500).send('Error al obtener la imagen')
    }
});


// Aquí definimos la ruta del creador de personajes, en GET y POST.

router.route('/personajes')
    .get(getPersonaje)
    .post(upload.single('imagen'), postPersonaje)

// Y en PUT y DELETE, identificándolos con el ID.

router.route('/personajes/:id')
.put(upload.single('imagen'), putPersonaje)
    .delete(deletePersonaje)

// A continuación creamos un Middleware para manejar las rutas no encontradas (404)

router.all('*', (req, res, next) => {
    const err = new Error('No encuentro el Endpoint');
    err.status = 404;
    next(err)
})
// Otro Middleware para manejar errores internos

router.use((err, req, res, next) => {
    console.error(err); // Imprime el error completo en la consola
    const { status = 500, statusText = 'Error interno de mi API' } = err;
    res.status(status).json({ status, statusText });
});


    
// Finalmente se exporta el router para su uso en otras partes de la aplicación.

module.exports = {router}
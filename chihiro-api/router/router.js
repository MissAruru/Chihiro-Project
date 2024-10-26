// Archivo router.js para configurar las rutas de Express:



// Primero importamos las dependencias necesarias:

const express = require('express')
const multer = require('multer')
const path = require('path')
const { postLogin } = require('../controllers/login.controller')
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller')


// Ahora configuramos el almacenamiento para Multer (subida de imagenes a la web)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

// Con esta función filtramos los tipos de archivos que se pueden subir a la web-

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (isValid) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'))
    }
}

//  Y con esto limitamos el tamaño y peso de las imágenes

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // En este caso son 5MB como máximo.
})


// Creamos un router de Express

const router = express.Router()

// Y definimos las rutas, en este caso la de login en post, para poder manejar el inicio de sesión

router.route('/login')
    .post(postLogin)

// Ruta principal GET /
router.get('/', (req, res) => {
    res.send('Haciendo / en GET');
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
    const { status = 500, statusText = 'Error interno de mi API' } = err
    res.status(status).json({ status, statusText })
})

    
// Finalmente se exporta el router para su uso en otras partes de la aplicación.

module.exports = {router}
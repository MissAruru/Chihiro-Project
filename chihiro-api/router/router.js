const express = require('express')
const multer = require('multer');
const path = require('path');
const { postLogin } = require('../controllers/login.controller')
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller')

// Configuración de multer para guardar las imágenes en una carpeta local
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo (único) con extensión original
    }
});

// Filtros para aceptar solo archivos de imagen
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
    }
};

// Límite de tamaño del archivo (por ejemplo, 5 MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});


const router = express.Router()

router.route('/login')
    .post(postLogin);

// Rutas para personajes
router.route('/personajes')
    .get(getPersonaje)
    .post(upload.single('imagen'), postPersonaje); 

router.route('/personajes/:id') // Cambiado para incluir el ID en la ruta
.put(upload.single('imagen'), putPersonaje) // `upload.single('imagen')` maneja la subida de una imagen con el campo 'imagen'
    .delete(deletePersonaje);

router.all('*' , ( req , res , next )=>{
    const err = new Error()
            err.status     = 404 
            err.statusText = `No encuentro el Endpoint`
    next(err)
    })

router.use(( err , req , res , next )=>{
    let { status , statusText } = err
            status     = status     || 500
            statusText = statusText || `Error interno de mi API`
        res.status(status).json({ status , statusText })
    })


module.exports = {router}
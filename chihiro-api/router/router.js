const express = require('express')
const multer = require('multer')
const path = require('path')
const { postLogin } = require('../controllers/login.controller')
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (isValid) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'))
    }
}


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
})


const router = express.Router()

router.route('/login')
    .post(postLogin)


router.route('/personajes')
    .get(getPersonaje)
    .post(upload.single('imagen'), postPersonaje)

router.route('/personajes/:id')
.put(upload.single('imagen'), putPersonaje)
    .delete(deletePersonaje)

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
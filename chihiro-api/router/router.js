const express = require('express')
const { postLogin } = require('../controllers/login.controller')
const { getPersonaje, postPersonaje, putPersonaje, deletePersonaje } = require('../controllers/personajes.controller')

const router = express.Router()

router.route('/login')
    .post(postLogin);

// Rutas para personajes
router.route('/personajes')
    .get(getPersonaje)
    .post(postPersonaje);

router.route('/personajes/:id') // Cambiado para incluir el ID en la ruta
    .put(putPersonaje)
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
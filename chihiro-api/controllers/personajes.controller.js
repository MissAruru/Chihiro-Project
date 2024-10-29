// Archivo personajes.controller.js desde el cual configuraremos el creador de personajes

// Importamos las dependencias necesarias...

const { Personajes } = require('./../models/models')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const controller = new AbortController()

// Y comenzamos a configurar. Comenzamos con el controlador para todos los personajes en método GET:

const getPersonaje = async (req, res, next) => {
    try {

        // Se busca a todos los personajes en la base de datos

        const personajes = await Personajes.find()
        

        // Convierte el _id en string
        
        const personajesFormatted = personajes.map(p => ({
            ...p._doc,
            _id: p._id.toString(),
            imagenUrl: p.imagen ? `/personajes/${p._id}/imagen` : null
        }))

        // Y devuelve la lista de personajes formateada.

        res.json(personajesFormatted)
    } catch (error) {
        console.error('Error al obtener personajes:', error.message) // Manejo de errores
        next(error) // Pasa el error al siguiente Middleware
    }
}


// Controlador para crear un nuevo personaje en método POST

const postPersonaje = async (req, res, next) => {
    const { nombre, nivel, raza, clase, descripcion } = req.body
    const imagen = req.file ? req.file.buffer : null; // Obtiene el nombre del archivo de imagen si se subió
    try {

        // Crea un nuevo personaje con las características y lo guarda en la base de datos.

        const nuevoPersonaje = new Personajes({
            nombre,
            nivel,
            raza,
            clase,
            descripcion,
            imagen: req.file ? req.file.buffer : null,
            imagenMimeType: req.file ? req.file.mimetype : null,
            imagenUrl: req.file ? `/personajes/${nuevoPersonaje._id}/imagen` : null 
        })

        await nuevoPersonaje.save();

        // Devuelve la lista de personajes después de crearlos

        const personajes = await Personajes.find()
        res.json(personajes)
    } catch (error) {
        console.error('Error al crear el personaje:', error.message) // Se visualizan los errores mediante un console.log
        next(error) // Pasa el error al siguiente Middleware
    }
}

// Controlador para actualizar un personaje ya creado en método PUT

const putPersonaje = async (req, res, next) => {
    try {
        const id = req.params.id // Se obtiene el ID del personaje a actualizar.

        // Verifica que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' })
            // Devuelve un error 400 si el ID no es válido
        }

        const personajeId = new mongoose.Types.ObjectId(id) // Convierte el ID a un ObjectId de Mongoose
        const updateData = {
            ...req.body, // Obtiene los datos
            imagen: req.file ? req.file.filename : undefined // También se actualiza la imagen si se obtiene una nueva.
        }

        // Busca y actualiza el personaje en la base de datos

        const personajeActualizado = await Personajes.findByIdAndUpdate(personajeId, updateData, { new: true })
        if (!personajeActualizado) {
            return res.status(404).json({ message: 'Personaje no encontrado' })  // Devuelve un error 404 si no se encuentra el personaje
        }
        res.json(personajeActualizado) // Devuelve el personaje actualizado
    } catch (error) {
        console.error('Error al actualizar el personaje:', error.message) // Console.log de error
        next(error) // Pasa el error al siguiente Middleware
    }
}

// Controlador para eliminar un personaje

const deletePersonaje = async (req, res, next) => {
    const { id } = req.params // Obtiene el ID del personaje a eliminar
    try {
        const personajeId = new mongoose.Types.ObjectId(id) // Convierte el ID a un ObjectId de Mongoose

        // Busca y elimina el personaje en la base de datos

        const result = await Personajes.findByIdAndDelete(personajeId)
        if (!result) {
            return res.status(404).json({ error: 'Personaje no encontrado' }) // Devuelve un error 404 si no se encuentra el personaje
        }
        res.status(200).json({ message: 'Personaje eliminado correctamente' }) // Devuelve un mensaje de que el personaje ha sido eliminado.
    } catch (error) {
        console.error('Error al eliminar el personaje:', error.message)
        next(error) // Pasa el error al siguiente middleware
    }
}


// Exporta las funciones del controlador para que puedan ser utilizadas en las rutas de la aplicación

module.exports = {
    getPersonaje,
    postPersonaje,
    putPersonaje,
    deletePersonaje
}

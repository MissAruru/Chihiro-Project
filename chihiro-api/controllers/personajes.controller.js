// Archivo personajes.controller.js desde el cual configuraremos el creador de personajes

// Importamos las dependencias necesarias...

const { Personajes } = require('./../models/models')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const cloudinary = require('../config/cloudinary')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const controller = new AbortController()

// Y comenzamos a configurar. Comenzamos con el controlador para todos los personajes en método GET:

const getPersonaje = async (req, res, next) => {
    try {

        // Se busca a todos los personajes en la base de datos

        const personajes = await Personajes.find()
        

        // Convierte el _id en string y genera la URL de la imagen
        
        const personajesFormatted = personajes.map(p => ({
            ...p._doc,
            _id: p._id.toString(),
            imagenUrl: p.imagenExtension ? `https://chihiro-api-sigma.vercel.app/uploads/${p._id}.${p.imagenExtension}` : null
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
    const { nombre, nivel, raza, clase, descripcion } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
        }

        // Sube la imagen a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            stream.end(req.file.buffer); // Enviar el buffer de la imagen a Cloudinary
        });

        const nuevoPersonaje = new Personajes({
            nombre,
            nivel,
            raza,
            clase,
            descripcion,
            imagenUrl: result.secure_url, // Guarda la URL de Cloudinary
        });

        await nuevoPersonaje.save();

        const personajes = await Personajes.find();
        res.json(personajes);
    } catch (error) {
        console.error('Error al crear el personaje:', error.message);
        res.status(500).json({ message: 'Error al crear el personaje', error: error.message });
    }
}



// Controlador para actualizar un personaje ya creado en método PUT

const putPersonaje = async (req, res) => {
    try {
        const id = req.params.id.trim();

        const updateData = {};
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer); // Enviar el buffer de la imagen a Cloudinary
            });
            updateData.imagenUrl = result.secure_url; // Guardar la URL segura de Cloudinary
        }

        // Actualizar personaje en MongoDB
        const personajeActualizado = await Personajes.findByIdAndUpdate(
            id,
            { ...req.body, ...updateData }, // Asegúrate de incluir los datos que se van a actualizar
            { new: true }
        );

        if (!personajeActualizado) {
            return res.status(404).send('Personaje no encontrado');
        }

        res.json(personajeActualizado);
    } catch (error) {
        console.error('Error al actualizar el personaje:', error.message);
        res.status(500).json({ message: 'Error al actualizar el personaje', error: error.message });
    }
};






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

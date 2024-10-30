
/*

Archivo personajes.controller.js, desde el cual tendremos nuestras de rutas para personajes junto a manejo de errores

*/

// Se importan las dependencias necesarias.


const { Personajes } = require('./../models/models')
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinary')

const multer = require('multer')
const storage = multer.memoryStorage()


// Configuramos Cloudinary para subir imágenes y aseguranos de que funciona correctamente

cloudinary.api.resources()
    .then(result => {
        console.log("Conexión exitosa a Cloudinary:", result)
    })
    .catch(err => {
        console.error("Error al conectar a Cloudinary:", err)
    })

// Primer controlador, en este caso GET para obtener todos los personajes, incluidos los archivos de imagen

const getPersonaje = async (req, res, next) => {
    try {
        const personajes = await Personajes.find()
        
        const personajesFormatted = personajes.map(p => ({
            ...p._doc,
            _id: p._id.toString(),
            imagenUrl: p.imagenUrl || null
        }));
        
        res.json(personajesFormatted)
    } catch (error) {
        console.error('Error al obtener personajes:', error.message)
        next(error) // Pasamos error al siguiente middleware
    }
}

// Segundo controlador, en este caso POST para crear personajes nuevos

const postPersonaje = async (req, res) => {
    const { nombre, nivel, raza, clase, descripcion } = req.body
    console.log("Datos recibidos:", req.body)
    try {
        // Creamos un objeto para el nuevo personaje
        const nuevoPersonajeData = { 
            nombre,
            nivel,
            raza,
            clase,
            descripcion,
        };

        // Verificamos si hay un archivo de imagen cargado y subimos a Cloudinary si existe
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            nuevoPersonajeData.imagenUrl = result.secure_url; // Solo agregamos la imagen si existe
        }

        // Creamos un nuevo personaje con los datos recibidos
        const nuevoPersonaje = new Personajes(nuevoPersonajeData);
        // Guardamos el personaje en la base de datos y enviamos como respuesta el personaje creado
        await nuevoPersonaje.save();
        res.status(201).json(nuevoPersonaje);
    } catch (error) {
        console.error('Error al crear el personaje:', error.message);
        next(error); // Manejo de errores, pasa al siguiente middleware
    }
}

// Controlador para actualizar personajes existentes, incluidos los archivos de imagen

const putPersonaje = async (req, res) => {
    try {
        const id = req.params.id.trim()
        const updateData = { ...req.body }
        // Si se sube una nueva imagen, esta se actualiza en Cloudinary y se agrega al personaje
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            updateData.imagenUrl = result.secure_url
        }
        // Actualizamos el personaje en la base de datos y verificamos su existencia
        const personajeActualizado = await Personajes.findByIdAndUpdate(id, updateData, { new: true })

        if (!personajeActualizado) {
            return res.status(404).json({ message: 'Personaje no encontrado' })
        }
    // Enviamos el personaje actualizado como respuesta
        res.json(personajeActualizado)
    } catch (error) {
        console.error('Error al actualizar el personaje:', error.message)
        next(error) // Manejo de errores, pasa al siguiente middleware
    }
}

const deletePersonaje = async (req, res) => {
    const { id } = req.params;
    try {
        const personajeId = new mongoose.Types.ObjectId(id)

        // Se busca y elimina el personaje en la base de datos
        
        const result = await Personajes.findByIdAndDelete(personajeId);

        if (!result) {
            return res.status(404).json({ error: 'Personaje no encontrado' })
        }
        // Enviamos un mensaje de confirmación de eliminación
        res.status(200).json({ message: 'Personaje eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar el personaje:', error.message)
        next(error)
    }
}

// Exportamos los controladores de personajes para utilizarlos en otras partes de la aplicación

module.exports = {
    getPersonaje,
    postPersonaje,
    putPersonaje,
    deletePersonaje
}

const { Personajes } = require('./../models/models')
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

const multer = require('multer');
const storage = multer.memoryStorage();


cloudinary.api.resources()
    .then(result => {
        console.log("Conexión exitosa a Cloudinary:", result);
    })
    .catch(err => {
        console.error("Error al conectar a Cloudinary:", err);
    });

const getPersonaje = async (req, res, next) => {
    try {
        const personajes = await Personajes.find();
        
        const personajesFormatted = personajes.map(p => ({
            ...p._doc,
            _id: p._id.toString(),
            imagenUrl: p.imagenUrl || null
        }));
        
        res.json(personajesFormatted);
    } catch (error) {
        console.error('Error al obtener personajes:', error.message);
        res.status(500).json({ error: 'Error al obtener personajes' });
    }
}

const postPersonaje = async (req, res) => {
    const { nombre, nivel, raza, clase, descripcion } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
        }

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

        const nuevoPersonaje = new Personajes({ // Cambia Personaje por Personajes
            nombre,
            nivel,
            raza,
            clase,
            descripcion,
            imagenUrl: result.secure_url,
        });

        await nuevoPersonaje.save();
        res.status(201).json(nuevoPersonaje);
    } catch (error) {
        console.error('Error al crear el personaje:', error.message);
        res.status(500).json({ message: 'Error al crear el personaje', error: error.message });
    }
}

const putPersonaje = async (req, res) => {
    try {
        const id = req.params.id.trim();
        const updateData = { ...req.body };

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
            updateData.imagenUrl = result.secure_url;
        }

        const personajeActualizado = await Personajes.findByIdAndUpdate(id, updateData, { new: true });

        if (!personajeActualizado) {
            return res.status(404).json({ message: 'Personaje no encontrado' });
        }

        res.json(personajeActualizado);
    } catch (error) {
        console.error('Error al actualizar el personaje:', error.message);
        res.status(500).json({ message: 'Error al actualizar el personaje', error: error.message });
    }
};

const deletePersonaje = async (req, res) => {
    const { id } = req.params;
    try {
        const personajeId = new mongoose.Types.ObjectId(id);
        const result = await Personajes.findByIdAndDelete(personajeId);

        if (!result) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }

        res.status(200).json({ message: 'Personaje eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el personaje:', error.message);
        res.status(500).json({ error: 'Error al eliminar el personaje' });
    }
}

module.exports = {
    getPersonaje,
    postPersonaje,
    putPersonaje,
    deletePersonaje
}

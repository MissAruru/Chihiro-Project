const { Personajes } = require('./../models/models');
const mongoose = require('mongoose');

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const getPersonaje = async (req, res, next) => {
    try {
        const personajes = await Personajes.find();
        
        // Convertir ObjectId a string en cada personaje
        const personajesFormatted = personajes.map(p => ({
            ...p._doc, // Acceder a los datos del documento sin metadatos adicionales
            _id: p._id.toString() // Convertir ObjectId a string
        }));

        res.json(personajesFormatted);
    } catch (error) {
        console.error('Error al obtener personajes:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const postPersonaje = async (req, res, next) => {
    const { nombre, nivel, raza, clase, descripcion } = req.body;

    try {
        const nuevo = new Personajes({ nombre, nivel, raza, clase, descripcion });
        await nuevo.save();

        const personajes = await Personajes.find();
        res.json(personajes);
    } catch (error) {
        console.error('Error al crear el personaje:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const putPersonaje = async (req, res) => {
    try {
        const id = req.params.id;
        // Convierte el ID en ObjectId si es necesario
        const personajeId = new mongoose.Types.ObjectId(id); 

        const personajeActualizado = await Personajes.findByIdAndUpdate(personajeId, req.body, { new: true });
        if (!personajeActualizado) {
            return res.status(404).json({ message: 'Personaje no encontrado' });
        }
        res.json(personajeActualizado);
    } catch (error) {
        console.error('Error al actualizar el personaje:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
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
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




module.exports = {
    getPersonaje,
    postPersonaje,
    putPersonaje,
    deletePersonaje
};

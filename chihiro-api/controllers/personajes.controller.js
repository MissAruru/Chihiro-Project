const { Personajes } = require('./../models/models');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo (único) con extensión original
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

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
    const imagen = req.file ? req.file.filename : null; // Obtén el nombre de la imagen subida
    
    try {
        const nuevo = new Personajes({ 
            nombre, 
            nivel, 
            raza, 
            clase, 
            descripcion, 
            imagen // Asegúrate de que el campo de la imagen se incluya
        });
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

        // Verificar si el ID tiene el formato correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const updateData = {
            ...req.body,
            imagen: req.file ? req.file.filename : undefined // Actualiza la imagen solo si hay una nueva
        };

        const personajeActualizado = await Personajes.findByIdAndUpdate(id, updateData, { new: true });
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

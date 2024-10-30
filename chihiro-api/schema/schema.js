
// Archivo schema.js que se utiliza para definir los esquemas de Mongoose para usuarios y personajes:

// Primero definimos el esquema para la colección de usuarios:

const mongoose = require('mongoose')


// Definimos el usuario y su clave (ambas de tipo String)

const usuariosSchema = new mongoose.Schema(
    { username : String, pass : String},
    { collection : 'usuarios' , versionKey : false}
)

// Definimos el esquema para la colección de personajes (creador de personajes):

const personajesSchema = new mongoose.Schema(
    {
        nombre: String,
        nivel: Number,
        raza: String,
        clase: String,
        descripcion: String,
        imagenUrl: { type: String }
    },
    { 
        collection: 'personajes',
        versionKey: false,
        timestamps: true // Agrega createdAt y updatedAt
    }
);

const Usuario = mongoose.model('Usuario', usuariosSchema);
const Personaje = mongoose.model('Personaje', personajesSchema);

// Finalmente exportamos ambos modelos para poder utilizarlos en otras partes de la aplicación
module.exports = {
    Usuario,
    Personaje,
};
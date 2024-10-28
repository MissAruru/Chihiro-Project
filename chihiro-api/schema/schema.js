
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
        imagen: Buffer, // Nuevo campo para almacenar la imagen como datos binarios
        imagenMimeType: String // Campo opcional para el tipo MIME de la imagen
    },

    // Toda la colección es de tipo String a excepción de nivel que sería tipo Number.

    {
        collection: 'personajes',
        versionKey: false
    }
)

// Finalmente exportamos ambos esquemas para poder utilizarlos en otras partes de la aplicación

module.exports = {
    usuariosSchema,
    personajesSchema,
}
const mongoose = require('mongoose')


const usuariosSchema = new mongoose.Schema(
    { username : String, pass : String},
    { collection : 'usuarios' , versionKey : false}
)

const personajesSchema = new mongoose.Schema(
    {
        nombre: String,
        nivel: Number,
        raza: String,
        clase: String,
        descripcion: String,
        imagen: String,
    },
    {
        collection: 'personajes',
        versionKey: false
    }
)


module.exports = {
    usuariosSchema,
    personajesSchema,
}
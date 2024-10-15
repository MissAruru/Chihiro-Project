// Archivo models.js
// Primero importamos la biblioteca de Mongoose para interactuar con MongoDB

const mongoose = require('mongoose')

// Importamos ambos esquemas definidos en el archivo schema.js

const { usuariosSchema, personajesSchema } = require('../schema/schema')

// Creamos un modelo de Mongoose para la colección de usuarios

const Usuario = mongoose.model('Usuario', usuariosSchema)

// Y otro para los personajes del creador.

const Personajes = mongoose.model('Personajes', personajesSchema)

// Finalmente, exportamos los modelos para poder utilizarlo en otras partes de la aplicación

module.exports = { Usuario, Personajes }
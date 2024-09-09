const mongoose = require('mongoose')

const { usuariosSchema, personajesSchema } = require('../schema/schema')

const Usuario = mongoose.model('Usuario', usuariosSchema)

const Personajes = mongoose.model('Personajes', personajesSchema)

module.exports = { Usuario, Personajes }
// Archivo login.controller.js desde el cual configuraremos el inicio de sesión

// Importamos el modelo de Usuario

const { Usuario } = require("../models/models")

// Define la función asíncrona para manejar el inicio de sesión

const postLogin = async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' }) // Con esto verificamos que se proporcione un usuario y una contraseña.
        }

        const buscar = await Usuario.findOne({ usuario, password }) // Buscamos en la base de datos los usuarios que coincidan con usuario y password.

        if (buscar) {
            res.json({ login: true }) // Si coinciden, iniciará sesión
        } else {
            res.status(401).json({ login: false, error: 'No se ha encontrado el usuario' }) // En el caso de que no dará este mensaje.
        }
    } catch (error) {
        next({ status: 500, statusText: error.message }) // Con esto manejamos el error en caso de que falle durante la ejecución y pasa el error al siguiente Middleware
    }
}

// Exporta la función postLogin para que pueda ser utilizada en otras partes de la aplicación

module.exports = { postLogin }

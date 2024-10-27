const { Usuario } = require("../models/models")
const bcrypt = require('bcrypt')

const postLogin = async (req, res, next) => {
    try {
        const { usuario, password } = req.body

        if (!usuario || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' })
        }

        const buscar = await Usuario.findOne({ usuario })
        if (buscar && await bcrypt.compare(password, buscar.password)) {
            res.json({ login: true });
        } else {
            res.status(401).json({ login: false, error: 'No se ha encontrado el usuario o la contraseña es incorrecta' })
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error)
        next({ status: 500, statusText: 'Error interno del servidor' })
    }
}

module.exports = { postLogin }

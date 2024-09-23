const { Usuario } = require("../models/models")

const postLogin = async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' })
        }
        const buscar = await Usuario.findOne({ usuario, password });

        if (buscar) {
            res.json({ login: true });
        } else {
            res.status(401).json({ login: false, error: 'Credenciales incorrectas' })
        }
    } catch (error) {
        next({ status: 500, statusText: error.message })
    }
}

module.exports = { postLogin }

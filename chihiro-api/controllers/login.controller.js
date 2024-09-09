const { Usuario } = require("../models/models")

const postLogin = async ( req, res, next ) => {
    try {
    const { usuario, password } = req.body

    const buscar = await Usuario.findOne({usuario, password})
    
    ?  res.json({ login : true })
    :  res.json({ login : false})
    }catch (error) {
        next({statusText : error.message})
    }
}

module.exports = { postLogin }
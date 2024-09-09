const { Personajes } = require('./../models/models')

const getPersonaje = async (req, res, next) => {
        
        const buscar = await Personajes.find()

        res.json(buscar)
    
}

const postPersonaje = async ( req, res, next ) => {

    const { nombre, nivel, raza, clase, descripcion, imagen } = req.body

    try {
        const nuevo = new Personaje({ nombre, nivel, raza, clase, descripcion, imagen })

        await nuevo.save()

        const buscar = await Personajes.find()

        res.json(buscar)

    } catch (error) {

        console.error('Error al crear el personaje:', error.message)

        res.status(500).json({ error: 'Internal server error' })
    }
};

const putPersonaje = async (req, res, next) => {

    const { id, ...datos } = req.body

    try {
        await Personajes.findByIdAndUpdate(id, datos)

        const buscar = await Personajes.find()

        res.json(buscar)

    } catch (error) {

        console.error('Error updating personaje:', error.message)

        res.status(500).json({ error: 'Internal server error' })

    }
}

const deletePersonaje = async (req, res, next) => { 
    const { id } = req.params;

    try {
        await Personajes.findByIdAndDelete(id);
        const buscar = await Personajes.find();
        res.json(buscar);
    } catch (error) {
        console.error('Error deleting personaje:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getPersonaje,
    postPersonaje,
    putPersonaje,
    deletePersonaje
}
/*

Archivo principal de la API. En ella encontramos la conexión a MongoDB, las opciones de CORS, y la inicialización de la API.

*/


// Cargamos las variables de entorno desde el archivo .env

require('dotenv').config()

// Y ahora se importan las dependencias necesarias.

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const { router } = require('./router/router')
const cors = require('cors')

const PORT = process.env.PORT || 3000 // Define el puerto de la aplicación (usa el de entorno o 3000 como predeterminado)
if (!process.env.MONGO_URI) {
    console.error('Falta la variable de entorno MONGO_URI');
    process.exit(1);
}
// Función asíncrona para conectar a la base de datos MongoDB
const conectar = async () => {
    try {
        // Intenta conectarse a la base de datos usando la variable de entorno MONGO_URI, si no, da error
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conectado a MongoDB`);
    } catch (err) {
        console.log(`Error de conexión a MongoDB: ${err}`);
    }
}

// Inicializamos la API con Express

const app = express();

// Y ahora configuramos las opciones de CORS para limitar el acceso a la API desde cualquier origen.

const corsOptions = {
    origin: [
        'https://chihiro-project.vercel.app',
        'https://chihiro-project.vercel.app/personajes'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}

// Aplicamos el middleware CORS con las opciones definidas

app.use(cors(corsOptions))

// Añadimos un middleware para parsear solicitudes en formato JSON y otra para URL-encoded

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Definimos el enrutador principal 

app.use(router)

// Y ahora la ruta para los archivos estáticos de imágenes subidas de forma local.

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Ahora añadimos un Middleware para manejar los errores

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo salió mal!')
})

// Iniciamos el servidor en el puerto definido y mostramos un mensaje de confirmación en caso de que se conecte.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

//Llamamos a la función para conectar a la base de datos 

conectar()

// Y finalmente exportamos la API.

module.exports = app
/*

* index.js
    Interacciones:
    - Cargar datos de una API
    Datos:
    - API fetch a mongodb://127.0.0.1:27017/personaje
    
    Datos de la API en MongoDB

    En este archivo también tenemos multer, con lo que podremos subir imagenes al proyecto final.
*/

require('dotenv').config();

console.clear()
console.log(`Iniciando JS`)

const PORT = process.env.PORT || 3000
const MONGO = process.env.MONGO_URI;
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const { router } = require('./router/router')
const fs = require('fs');


const conectar = async () => {
    try {
        await mongoose.connect(MONGO);
        console.log(`Conectado a MongoDB`);
    } catch (err) {
        console.log(`Error de conexión a MongoDB: ${err}`);
        process.exit(1);
    }
};


conectar()

const app = express()
const cors = require('cors')


const corsOptions = {
    origin: 'https://chihiro-project.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use(router);


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo salió mal!')
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Iniciando API en ${PORT}`));
}

module.exports = app;

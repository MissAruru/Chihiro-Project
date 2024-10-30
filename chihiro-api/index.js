require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { router } = require('./router/router');
const cors = require('cors');

const PORT = process.env.PORT || 3000


const conectar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conectado a MongoDB`);
    } catch (err) {
        console.log(`Error de conexión a MongoDB: ${err}`);
    }
}


const app = express();

const corsOptions = {
    origin: [
        'https://chihiro-project.vercel.app',
        'https://chihiro-project.vercel.app/personajes'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

conectar();


module.exports = app;
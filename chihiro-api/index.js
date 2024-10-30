require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { router } = require('./router/router');
const cors = require('cors');

const MONGO = process.env.MONGO_URI;

const conectar = async () => {
    try {
        await mongoose.connect(MONGO);
        console.log(`Conectado a MongoDB`);
    } catch (err) {
        console.log(`Error de conexión a MongoDB: ${err}`);
        // Don't exit the process, as it will stop the serverless function
        // process.exit(1);
    }
};

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Connect to MongoDB when the app starts
conectar();

// Remove the explicit server listening, as Vercel will handle this
// if (process.env.NODE_ENV !== 'production') {
//     app.listen(PORT, () => console.log(`Iniciando API en ${PORT}`));
// }

// Export the Express API
module.exports = app;
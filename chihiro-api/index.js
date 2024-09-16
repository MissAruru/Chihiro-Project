console.clear();
console.log(`Iniciando JS`);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path'); // Importa path
const { router } = require('./router/router');

const conectar = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/personajes');
        console.log(`Conectado a MongoDB`);
    } catch (err) {
        console.log(err);
    }
};

conectar();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Agrega el middleware de carga en una ruta de ejemplo
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('Archivo cargado con éxito');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(3000, () => console.log(`Iniciando API`));

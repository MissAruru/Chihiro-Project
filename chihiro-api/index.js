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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(router);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar el archivo con un timestamp
    }
});

const upload = multer({ storage: storage });

// Agrega el middleware de carga en una ruta de ejemplo
app.post('/upload', upload.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    res.status(200).send({ filePath: `uploads/${req.file.filename}` });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(3000, () => console.log(`Iniciando API`));

console.clear()
console.log(`Iniciando JS`)

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const {router} = require('./router/router')


const conectar = async () => await mongoose.connect(`mongodb://127.0.0.1:27017/personajes`)
                                .then( ()=> console.log(`Conectado a MongoDB`))
                                .catch( err => console.log(error))

conectar()


const app = express()

    app.use( cors())
    app.use( express.json())
    app.use( express.urlencoded({extended : false}))
    app.use(router)

    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage })

    
    app.listen (3000, ()=> console.log(`Iniciando API`))
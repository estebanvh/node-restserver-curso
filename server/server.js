require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// rutas globales
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {

    console.log("Escuchando en el puerto ", process.env.PORT);

    mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err, res) => {
        if (err) throw err;

        console.log('Base de datos online');

    });

});
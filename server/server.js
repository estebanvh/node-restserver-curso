require('./config/config');

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });

});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            mensaje: "Parámetro nombre es obligatorio"
        })
    } else {
        res.json({
            "usuario": body
        });
    }



});

app.put('/usuario', (req, resp) => {

    res.json('put usuario');
});

app.delete('/usuario', (req, resp) => {

    res.json('delete usuario');
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto ", process.env.PORT);
});
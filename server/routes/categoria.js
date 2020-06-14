const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');
const Categoria = require('../models/categoria');
const _ = require('underscore');

const app = express();


// mostrar todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {

    Categoria.find({ estado: true })
        .sort('nombre')
        .populate('idUser', 'nombre email')
        .exec((error, categoriaDB) => {

            if (error) {

                return JSON.status(500).json({
                    ok: false,
                    error
                });
            }

            Categoria.countDocuments((err, total) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if (!categoriaDB) {

                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "No se han encontrado categorías"
                        },
                        total
                    })
                }

                res.json({
                    ok: true,
                    categorias: categoriaDB,
                    total
                })


            })

        });

})

//mostrar una categoria por id
app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha encontrado la categoría"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

//crear categoria

app.post('/categoria', [verificaToken], (req, res) => {

    let idUser = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        idUser
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Error al crear la categoría, intente nuevamente"
                }

            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

//actualiza una categoria
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'estado']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha encontrado la categoría"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })


})

//borra una categoria actualizando su estado a false
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let estado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, estado, { new: true }, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha encontrado la categoría para borrar"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

module.exports = app;
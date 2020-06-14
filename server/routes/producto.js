const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const _ = require('underscore');

const app = express();
let Producto = require('../models/producto')


//==================
// Obtener productos
//==================

app.get('/productos', [verificaToken], (req, res) => {

    let desde = req.query.desde;
    let hasta = req.query.limite;


    Producto.find({ estado: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productosDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                })

            }

            Producto.countDocuments((err, total) => {

                if (err) {

                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if (!productosDB) {
                    return res.status(400).json({
                        ok: true,
                        err: {
                            message: "No se han encontrado productos"
                        }
                    })
                }

                res.json({
                    ok: true,
                    productos: productosDB,
                    total
                })

            })


        });

})

//=========================
// Obtener productos por ID
//=========================

app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro el producto"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

//=========================
// Buscar un producto
//=========================

app.get('/buscar', verificaToken, (req, res) => {

    let texto = req.query.buscar;

    let re = new RegExp(texto, 'i');

    Producto.find({ $or: [{ nombre: re }, { descripcion: re }] })
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encontro el producto"
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })


})

//=========================
// Crear un nuevo producto
//=========================

app.post('/productos', [verificaToken], (req, res) => {

    let usuario = req.usuario._id;
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario

    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Error al crear producto,intente nuevamente"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//=========================
// Actualizar un producto
//=========================

app.put('/produtos/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick([nombre, descripcion, precioUni, categoria, estado, disponible]);

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro el producto"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})


//=========================
// Borrar un producto
//=========================

app.delete('/produtos/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let estado = {
        estado: false
    }

    Producto.findByIdAndUpdate(id, (err, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro el producto"
                }
            })
        }

        res.json({
            ok: true,
            message: "Producto eliminado",
            producto: productoDB
        })

    }))

})



module.exports = app;
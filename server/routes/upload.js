const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verificaToken } = require('../middlewares/authentication');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const path = require('path');
const fs = require('fs');
const producto = require('../models/producto');


app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }

    //valida si url sea producto o usuario
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son: ' + tiposValidos.join(' | '),
                tipoSend: tipo
            }
        })

    }

    // el middleware fileuploads agrega todos los archivos que se suben
    // a la propiedad files de request
    let archivo = req.files.archivo;

    //Validación de extensión válida
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
    let extensionArchivo = archivo.name.split('.')[1];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(" | "),
                extension: extensionArchivo
            }
        })
    }

    //cambiar nombre nombre archivo
    let nombreArchivo = `${id}_${new Date().getTime()}.${extensionArchivo}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Imagen cargada, lista para actualizar en base de datos

        if (tipo === 'usuarios') {
            imagenUsuario(res, id, nombreArchivo)
        } else {
            imagenProducto(res, id, nombreArchivo);
        }
    });

})

function imagenUsuario(res, id, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, registro) => {

            if (err) {
                borrarArchivo('usuarios', nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: registro,
                img: nombreArchivo
            })


        });

    })

};


function imagenProducto(res, id, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            borrarArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {

            borrarArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            })
        }

        productoDB.img = nombreArchivo;

        productoDB.save((err, registro) => {

            if (err) {
                borrarArchivo('productos', nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: registro
            })

        })

    })

}

function borrarArchivo(tipo, nombreArchivo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);

    if (fs.existsSync) {

        fs.unlinkSync(pathImagen);

    }

}

module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();


app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: { mensaje: "Usuario o (contraseña) incorrecta" }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { mensaje: "Usuario o (contraseña) incorrecta" }
            });
        }


        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioDB,
            jwt: token
        })



    })

});

// configuración api google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }
}

app.post('/google', async(req, res) => {

    let id_token = req.body.idtoken;

    let googleUser = await verify(id_token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                message: {
                    err: e
                }
            })

        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: {
                    err: err
                }
            })
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: {
                        err: "Debe usar su usuario registrado por la aplicación"
                    }
                })
            } else {

                let token = jwt.sign({ usuario: usuarioDB },
                    process.env.SEED, {
                        expiresIn: process.env.CADUCIDAD_TOKEN
                    }
                );

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token

                })

            }

        } else {

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.picture,
                google: true,
                password: 'aqswdefrgthy'
            });

            usuario.save((err, usuarioDB) => {

                if (err) return res.status(500).json({
                    ok: false,
                    message: {
                        err: err
                    }
                })


                let token = jwt.sign({ usuario: usuarioDB },
                    process.env.SEED, {
                        expiresIn: process.env.CADUCIDAD_TOKEN
                    })

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }

    })

});

module.exports = app;
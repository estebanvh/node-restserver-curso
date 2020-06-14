const jwt = require('jsonwebtoken');


// ===========================
// Varificar token
// ============================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // get permite obtener los parametros del header del request

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    })

};

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        next();

    })

}

let verificaAdmin_Role = (req, res, next) => {

    let rol = req.usuario.role;

    if (rol != "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            err: {
                mensaje: "No cuenta con los privilegios de administrador"
            }
        })
    }

    next();

}

module.exports = {
    verificaToken,
    verificaTokenImg,
    verificaAdmin_Role
}
const mongoose = require('mongoose');
const Usuario = require('./usuario');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },

    descripcion: {
        type: String,
        required: false
    },

    estado: {
        type: Boolean,
        default: true
    },
    idUser: {
        type: Schema.ObjectId,
        ref: Usuario
    }

});


module.exports = mongoose.model('Categoria', categoriaSchema);
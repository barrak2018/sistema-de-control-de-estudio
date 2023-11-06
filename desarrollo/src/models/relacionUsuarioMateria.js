const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const relacionMateria = new Schema({
    idMateria: String,
    idUser: String
});

module.exports = mongoose.model('Relacion', relacionMateria);
const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const materiaSchema =new Schema({
    nombre:{ type: String},
    seccion: {
        type: String
    },
    horario: String,
    docente: String
});
module.exports = mongoose.model('Materia', materiaSchema);
const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    cedula: {
        type: String,
        unique: true
    },
    password: String,
    nombre: String,
    rol: String,
    sections: Array
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}



const User = mongoose.model('User', userSchema);

module.exports = User;
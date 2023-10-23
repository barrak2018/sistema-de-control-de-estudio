const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    cedula: String,
    password: String,
    nombre: String,
    rol: String,
    sections: Array
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(15))
}



const User = mongoose.model('User', userSchema);

module.exports = User;
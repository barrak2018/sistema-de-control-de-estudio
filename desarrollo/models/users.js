const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const userSchema = new Schema ({
    ci: {
        type: String,
        unique: true, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
});

//nuevo usuario
userSchema.pre('save', function(next){
    if (this.isNew || this.isModified('password')) {

        const document = this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword)=>{
            if(err){
                next(err);
            }else{
                document.password = hashedPassword;
                next();
            }
        })
    }else{
        next()
    }
})

// comparador de contraseñas

userSchema.methods.isCorrectPassword = function (candidatePassword, callback)  {
    bcrypt.compare(candidatePassword, this.password, function (err,same) {
        if (err){
            callback(err)
        }else{
            callback(err,same)
        }
    });
}


module.exports = model('User', userSchema)
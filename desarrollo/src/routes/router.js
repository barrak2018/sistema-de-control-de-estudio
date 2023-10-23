const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

router.get('/', (req, res)=>{
    res.redirect('/login')
});

router.get('/register',(req, res) => {
    res.render('registro');
})

router.post('/register', async(req, res)=>{
    const {password, cedula} = req.body;
    if(password != "" && cedula != ""){
        try {
            newUser =  new User();
            newUser.password = newUser.encryptPassword(password);
            newUser.cedula = cedula;
            console.log(newUser);
            await newUser.save();
            res.redirect('/');
            
        } catch (error) {
            console.log(error);
            res.redirect('/register');
        }
    }
    
})

router.get('/login',(req, res)=>{
    res.render('login')
})

router.post('/login',async(req, res)=>{
    const {password, cedula} = req.body;
    let user
    try {
        user = await User.findOne({cedula: cedula});
        
    } catch (error) {
        res.status(404).send('error!! intente nuevamente')
    }
    if (!user){
        res.status(404).send('usuario no existente');
    }
    const consulta = bcrypt.compareSync(password, user.password)
    if (consulta == true){
        res.send('ok')
    }
    else {
        res.send('error')
    }
})

module.exports = router;
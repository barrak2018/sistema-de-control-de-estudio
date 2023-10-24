const router = require('express').Router();
const User = require('../models/user');
const Materia = require('../models/materias')
const bcrypt = require('bcrypt-nodejs');

router.get('/', (req, res)=>{
    res.redirect('/login')
});


// genstion de ingreso (login)
router.get('/login',(req, res)=>{
    res.render('login')
})

router.post('/login',async(req, res)=>{
    const {password, cedula} = req.body;
    if (!password || !cedula){
        res.status(500).send("error")
    }
    let user = await User.findOne({cedula: cedula});
    if (!user){
        res.status(404).send('usuario no existente');
    }
    const consulta = bcrypt.compareSync(password, user.password)
    if (consulta == true){
        res.cookie('id', `${user.id}`, {maxAge: 1000 * 5})
        res.redirect('/profile')
    }
    else {
        res.send('error')
    }
})
//------------------------------------------------------------------------------------------


// inicio en el perfil

router.get('/profile', async(req, res)=>{
    if (!req.cookies.id){
        res.redirect('/')
    }else{
        const user =  await User.findById(req.cookies.id);
        if (user.rol == 'estudiante'){
            console.log('inicio de secion '+ user.nombre + ", " + user.rol );
            res.render('estudiantes/inicio', {username: user.nombre});
        }else if (user.rol == 'admin'){
            console.log('inicio de secion '+ user.nombre + ", " + user.rol);
            res.render('admin/inicio', {username: user.nombre});
        }
        
    }
})
//------------------------------------------------------------------------------------------

//registro de usuarios

router.get('/administracion/usuarios/register',(req, res) => {
    res.render('registro');
})

router.post('/register', async(req, res)=>{
    const {password, cedula, nombre, rol} = req.body;
    if(password != "" && cedula != ""){
        try {
            newUser =  new User();
            newUser.password = newUser.encryptPassword(password);
            newUser.cedula = cedula;
            newUser.rol = rol;
            newUser.nombre = nombre;
            console.log(newUser);
            await newUser.save();
            res.redirect('/');
            
        } catch (error) {
            console.log(error);
            res.redirect('/register');
        }
    }
    
})
//------------------------------------------------------------------------------------------


// gestion de manterias

router.get('/administracion/materias/crear',(req, res)=>{
    res.render('materias/crearMateria',{status: ""})
});

router.post('/administracion/materias/crear',async (req, res)=>{
    const {name, section, horario} = req.body;
    if(name != ""||section != ""){
        newMateria = new Materia();
        newMateria.nombre = name;
        newMateria.seccion = section;
        newMateria.horario = horario;
        try {
            await newMateria.save();
            console.log("materia creada...");
            res.render("materias/crearMateria", {status: 'correctamente agregado'})
        } catch (error) {
            
            console.log("error en la carga de la materia");
            res.render("materias/crearMateria", {status: 'error de registro'})
        }
        
    }else{
        res.render("materias/crearMateria", {status: "por favor rellene los campos"});
    }

});
//------------------------------------------------------------------------------------------
module.exports = router;
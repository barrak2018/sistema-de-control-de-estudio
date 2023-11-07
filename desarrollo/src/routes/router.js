const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
// modelos de base de datos
const User = require('../models/user');
const Materia = require('../models/materias')
const Relacion = require('../models/relacionUsuarioMateria');
const relacionUsuarioMateria = require('../models/relacionUsuarioMateria');





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
    }else{
        const consulta = bcrypt.compareSync(password, user.password)
        if (consulta == true){
            res.cookie('id', `${user.id}`, {maxAge: 1000 * 120})
            res.redirect('/profile')
        }
        else {
            res.send('error')
        }
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
            console.log('inicio de sision '+ user.nombre + ", " + user.rol );
            res.render('estudiantes/inicio', {username: user.nombre});
        }else if (user.rol == 'admin'){
            console.log('inicio de sesion '+ user.nombre + ", " + user.rol);
            res.render('admin/inicio', {username: user.nombre});
        }
        
    }
})

// gestion de materias del perfil
router.get('/profile/materias', async(req, res)=>{
    if (!req.cookies.id){
        res.redirect('/')
    }else{
        const user =  await User.findById(req.cookies.id);
        if (user.rol == 'estudiante'){
            const consulta = await Relacion.find({idUser: user.id});
            
            const ar = await Promise.all(consulta.map(async element => {
                return Materia.findById(element.idMateria);
            }));
            console.log(ar);
            res.render('estudiantes/materias', {username: user.nombre, mat: ar});

        }else if (user.rol == 'admin'){
            console.log('inicio de sesion '+ user.nombre + ", " + user.rol);
            res.render('admin/inicio', {username: user.nombre});
        }
        
    }
})





//------------------------------------------------------------------------------------------

//registro de usuarios

router.get('/register',(req, res) => {
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
// crear
router.get('/administracion/materias/crear',async (req, res)=>{
    let status;
    let data;
    if(req.cookies.status){
        status = req.cookies.status
    }else{
        status = ''
    }
    try {
        data = await Materia.find();
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
    console.log(data);
    res.render('materias/crearMateria',{
        status: status,
        lista: data
    })
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
            res.cookie("status", "materia creada correctamente", {maxAge: 5000})
            res.redirect("/administracion/materias/crear")
        } catch (error) {
            
            console.log("error en la carga de la materia");
            res.cookie("status", "error al cargar la materia")
            res.redirect("/administracion/materias/crear", {maxAge: 5000})
        }
        
    }else{
        res.cookie("status", "error desconocido");
        res.redirect("/administracion/materias/crear")
    }

});
// inscribir
router.get('/administracion/materias/inscribir', (req, res) => {
    res.render('materias/inscribir')
});

router.post('/administracion/materias/inscribir', async(req, res) => {
    const {cedula} = req.body;
    console.log('la cedula buscada es:' + cedula)
    try {
        const user = await User.findOne({cedula: cedula});
        if (!user){
            res.status(404).send('usuario no existente');
        }else{
        
            res.cookie('user',  { id: user.id, rol: user.rol}, {maxAge: (1000 * 60 )* 90 } )
            res.redirect('/administracion/materias/inscribir/seleccion')
        }
    } catch (error) {
        res.send('ocurrio un error' + error);
    }
})

router.get('/administracion/materias/inscribir/seleccion', async(req, res) => {
    if (!req.cookies.user) {
        res.send('error')
    }else{
        try {
            const materias = await Materia.find()
            res.render('materias/seleccion', {materias: materias})
        } catch (error) {
            console.log(error);
        }
    }
});
router.post('/administracion/materias/inscribir/seleccion', async(req, res) => {
    
    const {mSelected} =  req.body;
    const {id, rol} = req.cookies.user;
    const comprobacion = await Relacion.find({idMateria: mSelected})
    console.log(comprobacion)
    let repetido = false
    
    comprobacion.forEach(element => {
        if (element.idUser == id){
            repetido =  true
            console.log('repetido');
        }
        else{
            console.log(element.id+ ' no repetido')
        }
    });


    if (repetido == false) {
        let newRelacion = new Relacion();
        newRelacion.idMateria = mSelected;
        newRelacion.idUser = id;
        try {
            await newRelacion.save();
            res.send('materia creada')
            
        } catch (error) {
            console.log(error)
        }
        
    }else{
        res.send('materia ya inscrita')
    }

    
});

//[------------------------------------------------------------------------------------------
module.exports = router;

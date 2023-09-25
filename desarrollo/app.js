const express = require('express')
const path = require('path')
const BodyParser = require('body-parser')
const User = require('./models/users')

//inits
const app = express()

require('./database')

//settings
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.get("/", (req,res)=>{
    
})
app.get("/docente", (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'public/teacher-login.html'))
})

app.get("/admin", (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'public/admin-login.html'))
})

app.get("/demo", (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'public/adminDEMO.html'))
})



app.post('/register', (req,res)=>{
    const item = req.body
    const ci= item.ci
    const password = item.password
    //console.log(ci, " ", password)

    const user = new User({ci, password})
    user.save((err)=>{
        if (err){
            res.status(500).send(err)
        }else{
            res.status(200).send('registro correccto')
        }
    })
})

app.post('/login',(req,res)=>{
    const item = req.body
    const ci= item.ci
    const password = item.password

    User.findOne({ci}, (err, user)=>{
        if (err){
            res.status(500).send('Error al autenticar el usuario')
        }else if(!user) {
            res.status(500).send("El usuario no existe")

        }else{
            user.isCorrectPassword(password, (err, result)=>{
                if (err){
                    res.status(500).send('error de authentication')
                }else if(result){
                    res.status(200).send('ingreso correctamente~')
                }else{
                    res.status(500).send('usuario o contraseña incorrecta')
                }
            })
        }
    })
})


app.listen(3000,()=>{
    console.log('server online')
})
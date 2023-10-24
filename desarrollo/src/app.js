const express = require('express');
const path =  require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

//setings
const port = process.env.port|| 3000;
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'views')))
app.use(morgan('dev'))
//midleware
require('./database')
app.use(cookieParser())

//routers
app.use('/', require('./routes/router'));

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})
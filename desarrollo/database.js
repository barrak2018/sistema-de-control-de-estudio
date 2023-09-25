const mongoose = require('mongoose');
const URI = "mongodb://127.0.0.1:27017/control-de-estudio"

mongoose.connect(URI, (err)=>{
    if (err){
        throw err
    }else{
        console.log('database connected')
    }
})
const mongoose = require('mongoose');
const user = 'Barrak '
const password = 'RlAbLlVcA5sFEtEp'
const url = `mongodb://127.0.0.1:27017/prototipo4`
mongoose.connect(url,{
    
}).then(db => console.log(`database connected: ${url}`))
  .catch(err => console.log(err))  
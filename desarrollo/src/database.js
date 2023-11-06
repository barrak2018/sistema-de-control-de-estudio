const mongoose = require('mongoose');
const user = 'apiUser'
const password = 'u80rebZJF8VywYse'
//const url = `mongodb+srv://${user}:${password}@barrak.5kjxiqp.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb://127.0.0.1:27017/prototipo4`
mongoose.connect(url,{
    
}).then(db => console.log(`database connected: ${url}`))
  .catch(err => console.log(err))  
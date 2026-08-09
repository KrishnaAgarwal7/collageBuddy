const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then((result)=>{
    console.log('MongoDB connected');
    app.listen(PORT, () =>{
      console.log("Listening on port 3000...");
    })  
  }).catch((err)=>{
    console.log(err);
  })


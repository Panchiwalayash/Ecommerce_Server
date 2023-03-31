const mongoose=require('mongoose');
require('dotenv').config()

const MONGO=process.env.MONGO_URL;

const connectToMongo=()=>{
    mongoose.connect(MONGO,{useNewUrlParser:true})
    .then(()=>{console.log("Successfully connected to mongodb")})
    .catch((err)=>{console.log(`Error occured: ${err}`)})
}


module.exports=connectToMongo
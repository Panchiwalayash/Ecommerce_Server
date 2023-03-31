const mongoose=require('mongoose')
const {Schema}=mongoose;

const OwnerSchema=new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String
    }
})

const Owner=mongoose.model('Owner',OwnerSchema)
module.exports=Owner
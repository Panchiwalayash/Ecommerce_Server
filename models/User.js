const mongoose=require('mongoose')
const {Schema}=mongoose

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    userImg:{
        type:String,
    },
    Date:{
        type:Date,
        default:Date.now
    },
    orderHistory:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'}
    ]
},
{timestamps:true})

const User=mongoose.model('User',UserSchema)

module.exports=User
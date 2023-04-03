const mongoose=require('mongoose')
const {Schema}=mongoose;

const ProductSchema =new Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },  
    imgUrl:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:20
    }
},{
    timestamps:true
})

const Product=mongoose.model('Product',ProductSchema)
module.exports=Product
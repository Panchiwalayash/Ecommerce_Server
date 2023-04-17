const mongoose=require('mongoose')
const {Schema}=mongoose;

const CartSchema =new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
        },
        name:String,
        imgUrl:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }}
    ]
},{
    timestamps:true
})
const Cart=mongoose.model('Cart',CartSchema)

module.exports=Cart
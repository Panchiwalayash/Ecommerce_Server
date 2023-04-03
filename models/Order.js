const mongoose=require('mongoose')
const {Schema}=mongoose;

const OrderSchema =new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    productlist:[
        {productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
            },
            name:String,
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }}
    ],
    totalCost:Number,
},{
    timestamps:true
})
const Order=mongoose.model('Order',OrderSchema)

module.exports=Order
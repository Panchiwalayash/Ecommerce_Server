const mongoose=require('mongoose')
const {Schema}=mongoose;

const OrderSchema =new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:String,
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
    state:{
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
      },
    phoneNo:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    productlist:[
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
    ],
    totalCost:Number,
    paymentType:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Accepted",
        required:true
    }
},{
    timestamps:true
})
const Order=mongoose.model('Order',OrderSchema)

module.exports=Order
const express=require('express')
const router=express.Router()
const fetchUser=require('../../middleware/fetchUser')
const Order=require('../../models/Order')
const Cart=require('../../models/Cart')
const User=require('../../models/User')
const Product = require('../../models/Product')
const shortid = require('shortid');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

// create order
router.post('/create/:id',fetchUser,async(req,res)=>{
    try {
        const cart=await Cart.findById(req.params.id)
        const itemList=cart.products;
        let totalPrice=0;
        for (let i = 0; i < itemList.length; i++) {
            const prod=await Product.findById(itemList[i].productId)
            prod.quantity-=itemList[i].quantity
            await prod.save()
            totalPrice+=itemList[i].price
        }
        const date = new Date();

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        const newOrder=await Order.create({
            userId:req.user.id,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            pincode:req.body.pincode,
            phoneNo:req.body.phoneNo,
            orderId:shortid.generate(),
            productlist:itemList,
            date:formattedDate,
            totalCost:totalPrice,
            paymentType:req.body.paymentType
        })

        const user=await User.findById(req.user.id)
        user.orderHistory.push(newOrder._id)
        await user.save()
        await cart.deleteOne()
        res.status(200).json()
        
    } catch (error) {
        res.status(500).json(`Some internal error occured ${error}`)
    }
})

//get orders
router.get('/getorder',fetchUser,async(req,res)=>{
    try {
        const orders=await Order.find({userId:req.user.id})
        res.status(200).json(orders)

    } catch (error) {
        res.status(500).json(`Some internal error occured ${error}`)
    }
})

module.exports=router
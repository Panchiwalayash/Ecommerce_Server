const express=require('express')
const router=express.Router()
const fetchAdmin=require('../../middleware/fetchAdmin')
const Order=require('../../models/Order')
const Cart=require('../../models/Cart')

router.post('/create/:id',fetchAdmin,async(req,res)=>{
    try {
        const cart=await Cart.findById(req.params.id)
        const itemList=cart.products;
        let totalPrice=0;
        for (let i = 0; i < itemList.length; i++) {
            totalPrice+=itemList[i].price
        }

        const newOrder=await Order.create({
            userId:req.user.id,
            address:req.body.address,
            city:req.body.city,
            phoneNo:req.body.phoneNo,
            productlist:itemList,
            totalCost:totalPrice
        })

        res.status(200).json({newOrder})
        
    } catch (error) {
        res.status(500).json(`Some internal error occured ${error}`)
    }
})

router.delete('/delete/:id',fetchAdmin,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id)
        if(!order){
            res.status(402).send("Order do not exist")
        }

        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted successfully")
        
    } catch (error) {
        res.status(500).json(`Some internal error occured ${error}`)
    }
})

module.exports=router
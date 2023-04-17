const express=require('express')
const router=express.Router()
const Product=require('../../models/Product')

//get all products
router.get('/getproduct',async(req,res)=>{
    try {
        const product=await Product.find();
        res.status(201).json({product})
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})

//get product by id
router.get('/get/:id',async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            res.status(400).send("Product does not exist")
        }
        res.status(201).json({product})
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})

//Search product
router.get('/search',async(req,res)=>{
    try {
        const query=req.query.q
        const products = await Product.find({
            name: { $regex: query, $options: "i" },
          });
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})
module.exports=router
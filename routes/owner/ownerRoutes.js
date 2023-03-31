const express=require('express')
const router=express.Router()
const Owner=require('../../models/Owner')
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const Token=process.env.JWT_RESULT
const Product=require('../../models/Product')
const fetchAdmin=require('../../middleware/fetchAdmin')
const cloudinary = require('cloudinary').v2;
const upload=require('../../middleware/multer')

// Connecting with cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

// Admin Signup
router.post('/',
    body('email',"Enter a valid mail").isEmail(),
    body('password',"Enter the passord with minimum length 5").isLength({min:5}),
    async(req,res)=>{

        //checking request input error
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        try {

            //checking if admin exist by given email
            const admin=await Owner.findOne({email:req.body.email});
            if(admin){
                res.status(400).json({error:"Please enter correct detail"})
            }

            //if admin exits, checking inputed password correct
            if(admin.password!==req.body.password){
                res.status(400).json({error:"Please enter correct detail"})
            }
            const data={
                id:admin.id
            }

            // producing token using jsonwebtoken
            const authToken=jwt.sign(data,Token)

            res.status(200).json({authToken})
        } catch (error) {
            res.status(500).json(`Some internal error occured ${error}`)
        }
    }
)

//get all products
router.get('/getproduct',fetchAdmin,async(req,res)=>{
    try {
        const product=await Product.find();
        res.status(201).json({product})
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})

// creating product
router.post('/createproduct',fetchAdmin,upload.single('image'),async(req,res)=>{
        try {

            const product=new Product({
                name:req.body.name,
                desc:req.body.desc,
                price:req.body.price,
                imgUrl:req.file.path
            })

            // using cloudinary to store image
            const result = await cloudinary.uploader.upload(req.file.path)
            product.imgUrl = result.secure_url;

            const newProduct = await product.save();

            res.status(200).json("Product has been added"); 
        } catch (error) {
            res.status(500).json(`Some internal error occured ${error}`)
        }
    }
)

//update product
router.put("/updateproduct/:id",fetchAdmin,async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(!product){
            res.status(402).send("product not found")
        }
        const newProduct=new Product({

        })
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})

//deleting product
router.delete('/deleteproduct/:id',fetchAdmin,async(req,res)=>{
    try {
        
        const product=await Product.findById(req.params.id)
        if(!product){
            res.status(402).send("Product not found")
        }

        await Product.findByIdAndDelete(req.params.id)
        
        res.status(201).send("Product deleted")
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`)
    }
})

module.exports=router
const express = require("express");
const router = express.Router();
const Owner = require("../../models/Owner");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const Token = process.env.JWT_RESULT;
const Product = require("../../models/Product");
const upload = require("../../middleware/multer");
const cloudinary = require("cloudinary").v2;
const fetchAdmin = require("../../middleware/fetchAdmin");
const User = require("../../models/User");
const Order = require("../../models/Order");

// Admin Signup
router.post(
    "/signin",
    body("email", "Enter a valid mail").isEmail(),
    body("password", "Enter the password with minimum length 5").isLength({
        min: 5,
    }),
    async (req, res) => {
        //checking request input error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //checking if admin exist by given email
        const admin = await Owner.findOne({ email: req.body.email });
        if (!admin) {
            res.status(400).json({ error: "Please enter correct detail" });
        } else {
            //if admin exits, checking inputed password correct
            if (admin.password !== req.body.password) {
                res.status(400).json({ error: "Please enter correct password" });
            }

            const data = {
                id: admin.id,
            };
            // producing token using jsonwebtoken
            const adminToken = jwt.sign(data, Token);

            res.status(200).json({ adminToken });
        }
    }
);

//get all products
router.get("/getproduct", async (req, res) => {
    try {
        const product = await Product.find();
        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

// creating product
router.post("/createproduct", upload.single("image"), async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            imgUrl: req.file.path,
            quantity: req.body.quantity,
        });

        // using cloudinary to store image
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imgUrl = result.secure_url;

        const newProduct = await product.save();

        res.status(200).json("Product has been added");
    } catch (error) {
        res.status(500).json(`Some internal error occured ${error}`);
    }
});

//update product
router.put("/updateproduct/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(402).send("product not found");
        }
        const newProduct={
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            imgUrl: req.file.path,
            quantity: req.body.quantity,
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        newProduct.imgUrl = result.secure_url;

        await Product.findByIdAndUpdate(req.params.id,{$set: newProduct})
        res.status(200).json("edited successfully")
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

//deleting product
router.delete("/deleteproduct/:id", async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(402).send("Product not found");
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(201).send("Product deleted");
});

//get user by search
router.get("/getuser", fetchAdmin, async (req, res) => {
    try {
        const query = req.query.u;
        const users = await User.find({
            name: { $regex: query, $options: "i" },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

//get products using search
router.get("/getproduct/search", fetchAdmin, async (req, res) => {
    try {
        const query = req.query.q;
        const product = await Product.find({
            name: { $regex: query, $options: "i" },
        });
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

router.get("/getorder", fetchAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

//get products by id
router.get("/getproduct/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(400).send("Product does not exist");
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
});

//analytics part of admin dashboard
router.get("/analytic/",fetchAdmin,async(req,res)=>{
    try {
        const userNo=await User.find().count()
        const orderNo=await Order.find().count()
        const productNo=await Product.find().count()

        res.status(200).json({userNo,orderNo,productNo})
    } catch (error) {
        res.status(500).json(`Some internal error occured- ${error}`);
    }
})
module.exports = router;

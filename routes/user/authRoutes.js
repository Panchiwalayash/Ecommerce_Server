const express=require('express')
const router=express.Router()
const User=require('../../models/User')
const jwt=require('jsonwebtoken')
const fetchUser=require('../../middleware/fetchUser')
const bcrypt=require('bcryptjs')
const upload=require('../../middleware/multer')
const { body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const Token=process.env.JWT_RESULT

// creating user
router.post('/signup',upload.single('image'),
body('email',"Enter valid email").isEmail(),
body('password',"minimum length is 5").isLength({min:5}),
async(req,res)=>{

    //checking request input error
    const errors=validationResult(req) 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

        try {
            //checking if user exist by given email
            const user=await User.findOne({email:req.body.email})
            if(user){
                res.status(400).json({error:"A user with this email already exist"})
            }

            // hashing password with the help of bcrypt
            const salt=await bcrypt.genSalt(15);
            const hashPassword=await bcrypt.hash(req.body.password,salt)

            // creating new user with hashed password
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                password:hashPassword,
                userImg:req.file.path,
            })
            const result = await cloudinary.uploader.upload(req.file.path)
            newUser.userImg = result.secure_url;
             await newUser.save();

            res.status(201).json("account created")
        } catch (error) {
           res.status(500).json(`Some internal error occured ${error}`)
        }
    }
)

// signing in user
router.post('/signin',
    body('email',"Email Id should be valid").isEmail(),
    body('password',"Minimum length of password is 5").isLength({min:5}),
    async(req,res)=>{

        //checking request input error
        const errors=validationResult(req) 
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            //checking if admin exist by given email
            const user=await User.findOne({email:req.body.email})
            if(!user){
             return res.status(400).json({error:"please enter valid credential"})
            }

            // comparing hashed password with the input password
            const passwordCompare=await bcrypt.compare(req.body.password,user.password)
            if(!passwordCompare){
             return res.status(400).json({error:"please enter valid credential"})
            }

            const data={
                id:user.id
            }

            // generating token for user
            const userToken=jwt.sign(data,Token)
            res.status(200).json({userToken})
            
        } catch (error) {
          res.status(500).send("some internal error occured")
            
        }
    }
)

//get user
router.get('/getuser',fetchUser,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({error:"please enter valid credential"})
           }
        
        res.status(200).json({"userName":user.name,"userImg":user.userImg})
    } catch (error) {
        res.status(500).send("some internal error occured")
    }
})

module.exports=router
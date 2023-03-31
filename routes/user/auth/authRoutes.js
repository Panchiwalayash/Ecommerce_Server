const express=require('express')
const router=express.Router()
const User=require('../../../models/User')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

const Token=process.env.JWT_RESULT

// creating user
router.post('/signup',
    body('email',"Email Id should be valid").isEmail(),
    body('password',"Minimum length of password is 5").isLength({min:5}),
    async(req,res)=>{

        //checking request input error
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
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
            const newUser=await User.create({
                name:req.body.name,
                email:req.body.email,
                password:hashPassword
            })

            const data={
                id:newUser.id
            }
            
            // generating token using jsonwebtoken
            const authToken=jwt.sign(data,Token)

            res.status(201).json({authToken})
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
            const authToken=jwt.sign(data,Token)
            res.status(200).json({authToken})
            
        } catch (error) {
          res.status(500).send("some internal error occured")
            
        }
    }
)

module.exports=router
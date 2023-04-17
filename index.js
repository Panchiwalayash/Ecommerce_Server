const express=require('express')
require('dotenv').config()
const connectToMongo=require('./db')
const cors=require('cors')
const cloudinary = require('cloudinary').v2;

// connecting to database
connectToMongo();

// Connecting with cloudinary
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.API_KEY,
api_secret:process.env.API_SECRET
})

const app=express()

app.use(express.json())

app.use(cors())


//creating routes
app.use('/admin',require('./routes/owner/ownerRoutes'))
app.use('/api/auth',require('./routes/user/authRoutes'))
app.use('/api/cart',require('./routes/user/cartRoutes'))
app.use('/api/product',require('./routes/user/productRoutes'))
app.use('/api/order',require('./routes/user/orderRoutes'))


const port=5000

app.listen(port,()=>{
    console.log(`Your app is running on http://localhost:${port}`)
})
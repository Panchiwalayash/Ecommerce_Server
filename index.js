const express=require('express')
require('dotenv').config()
const connectToMongo=require('./db')

// connecting to database
connectToMongo();

const app=express()

app.use(express.json())

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
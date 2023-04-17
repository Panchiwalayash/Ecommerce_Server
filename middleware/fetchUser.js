// middleware for verifying the user

var jwt = require('jsonwebtoken');
const TOKEN=process.env.JWT_RESULT

fetchUser=(req,res,next)=>{
    const token=req.header('userToken');
    if(!token){
        res.status(401).send({error:"please authenticate a valid token"})
    }
    try {
        const data=jwt.verify(token,TOKEN);
        req.user=data;
        next();       
    } catch (error) {
        res.status(401).send({error:"please authenticate a valid token"})  
    }    
    
}

module.exports=fetchUser;
const jwt =require('jsonwebtoken');
const { jwtSecret } = require('../config/envConfig');

const verifyToken = (token,secretKey)=>{
    return jwt.verify(token,secretKey)
}

const authenticate = async(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success:false,
            message:'User is Unauthorized!'
        })
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken(token,jwtSecret)

    req.user = payload;

    next();
}

module.exports = authenticate
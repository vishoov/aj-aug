//here we'll be implementing jwt authentication middleware

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.JWT_SECRET;

const createToken = async (user)=>{
    try{
        const token = await jwt.sign(
            //payload 
            {
                id:user._id,
                email:user.email
            },
            secretKey,
            {
                //1 month
                expiresIn:'365d',
                // algorithm:'HS256'
                // issuer:'vishooverma.com',
                // audience:'vishoosapi.com/users'
            }
        )

        return token;
    }
    catch(err){
        throw new Error("Error creating token");
    }
}

const verifyToken = async (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({error:"Unauthorized: No token provided"}); 
        }
        //Authorization : "Bearer tokenValue"


        const token = authHeader.split(' ')[1];

        //verify the token using jwt verify methodx`
        const decoded = await jwt.verify(token, secretKey);
        

        next();
    }   
    catch(err){
        return res.status(401).json({error:"Unauthorized: Invalid token"});
    }

}


module.exports = {
    createToken,
    verifyToken
}
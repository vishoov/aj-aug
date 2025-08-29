const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const createToken= async (payload)=>{
    try{
        return await jwt.sign(payload, JWT_SECRET, {expiresIn:"100d"});
    }
    catch(err){
        throw err;
    }
}



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }


    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, email, ... }
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};


module.exports = {
    createToken,
    authenticateToken
}

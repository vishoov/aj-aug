//rate limiting 

//import
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes // decides the time frame for which requests are checked/remembered
    max:5000, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"

})

module.exports = limiter;
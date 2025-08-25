

const loggingMiddleware = (req, res, next) => {

    try{
        console.log(`${new Date().toLocaleString()} - ${req.method} ${req.originalUrl}`);
        next();
    }
    catch(err){
        console.error('Logging Middleware Error:', err);
        next(err);
    }
}

module.exports = loggingMiddleware;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./view/users.routes');
const loggingMiddleware = require('./middlewares/logging.mw');
const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');

const mongoURI = process.env.MONGO;
const limiter = require('./middlewares/rate-limit');
mongoose.connect(mongoURI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

app.use(limiter); // Apply rate limiting middleware to all requests
app.use(loggingMiddleware);

// import sessionIDs from './sessionIDs.js';
// app.use((req, res, next)=>{
//     const clientID = req.header('Client-ID');

//     const sessionID = sessionIDs.find(id => id === clientID);



//     if(!sessionID){
//         return res.status(401).json({error:"Unauthorized: Invalid Client-ID"});
//     }
//     next();



// })



// //middleware error handling 
// //this will catch errors from async functions
const errorHandler = (err, req, res, next)=>{
    
    res.status(500).json({error:err.message || "Internal Server Error"},
        {
            status:error.status || 500
        }
    );
    console.error("Error", err);
    next();
}

app.use(errorHandler);

app.use(express.json());

app.use(userRoutes);


app.get("/", async (req, res)=>{
    try{
        res.sendFile(__dirname + '/index.html');

    }catch(err){
        console.error('Error handling request:', err);
        res.status(500).send('Internal Server Error');
    }
})

const PORT = 3000;

app.listen(PORT, ()=>{
    try{
        console.log(`Server is running on port ${PORT}`);
    }
    catch(err){
        console.error('Error starting server:', err);
    }
})
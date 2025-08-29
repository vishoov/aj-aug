const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userRoutes = require('./view/user.routes');
const productRoutes = require('./view/product.routes');

//connecting to mongoDB
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});


//middlewares
app.use(express.json());

//logging middleware
const logger = (req, res, next)=>{
    try{
        const time = new Date();
        const method = req.method;
        const url = req.url;
        console.log(`[${time}] ${method} ${url}`);
        next();
    }catch(err){
        res.status(500).json(err);
    }
}


//routes

app.use("/", userRoutes);
app.use("/", productRoutes);
app.use(logger);




app.get("/", (req, res)=>{
    try{
    res.status(200).json("Welcome to E-commerce API");
    }
    catch(err){
        res.status(500).json(err);
    }
})



app.listen(3000, ()=>{
    console.log("server started at 3000");
})
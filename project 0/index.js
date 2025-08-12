const express = require("express");
//import statement 

const app = express();
//create an express app that will be live to build the api and hence the features



//routes for our application 

app.get("/", (req, res)=>{
     res.send("Hello world")
})



const PORT = 3000;

//write a port listener 
app.listen(PORT, ()=>{
    console.log("The server is live on port 3000")
})
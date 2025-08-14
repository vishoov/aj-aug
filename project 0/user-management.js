const express = require('express');
const app = express();
const userRouter = require('./View/user.view.js');



app.use(express.json()); // Middleware to parse JSON bodies

const errorHandler = (err, req, res, next)=>{
    console.error("Error occured:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message: message,
        error: err
    })
}

app.use(errorHandler); // Use the error handler middleware

app.use("/", userRouter); // Mount the user router on the /users path


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const express = require("express");
const router = express.Router();
const User = require('../Model/user.model.js'); //importing the User model
//Router is used to create modular, mountable route handlers
//modular-> it can be used in different parts of the application
//mountable -> it can be mounted on a specific path
const { signup, home, getUserByID } = require("../Controller/user.controller.js"); //importing the signup function from the controller

router.post("/create-user", signup); //this imports the signup function from the controller and mounts it on the /create-user path
router.get("/home", home); //this imports the home function from the controller and mounts it on the /home path
router.get("/users/:id", getUserByID); 

router.get("/users", async (req, res)=>{
    try{
        const users = await User.find(
            {}, //empty object means we want to fetch all users
            // 'name role -_id' //we can specify which fields we want to fetch
        ).lean(); //this will fetch all users from the database
        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    }
    catch(err){
        console.error("Error fetching users:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})



router.post('/create-multiple', async (req, res) => {
    try{
        const users = req.body; //an array of user objects 

        const newUsers = await User.insertMany(users); //this will save multiple users to the database

        console.log("Users created:", newUsers);
        res.status(201).json({
            message: "Users created successfully",
            data: newUsers
        })
    }
    catch(err){
        console.error("Error creating multiple users:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})




router.get("/user", async (req, res)=>{
    try{

        // //find a user with name Accio
        // const user = await User.findOne(
        //     {
        //         email:"accio@accio.com"
        //     }
        // )

        //multiple conditions
        //AND -> necessarily all conditions should be true
        const user = await User.find(
            {
                $nor:[
                    {
                        email:"accio@accio.com"
                    },
                    {
                        role:"user"
                    }
                ]
            }
        )



res.status(200).json({
            message: "User fetched successfully",
            data: user
        });

    }
    catch(err){
        console.error("Error fetching user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})


router.get("/compare", async (req, res)=>{
    try{
        //comparing the ages 
        const users = await User.find(
            {
                age:{
                    $nin : [ 30, 40, 18] //find users with age 20, 30, 40 or 18
                }
            }
        )
        res.status(200).json({
            message: "Users compared successfully",
            data: users
        });
    }
    catch(err){
        console.error("Error comparing users:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})


router.get("/", home)

module.exports = router;
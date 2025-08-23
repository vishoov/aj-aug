
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


router.put("/updateinfo", async (req, res)=>{
    try{
        const { email, newemail } = req.body; //extracting email from the request body
        
        // const updatedUser = await User.updateOne(
        //     {
        //         email:email //find the user with the given email
        //     },
        //     {
        //         $set:
        //         {
        //             email:newemail //update the email to the new email
        //         }
        //     }
        // )

        const updatedUser = await User.updateMany(
            {
                age:{
                    $gt:18
                }
            },
            {
                $set:{
                    name:"A user who can Vote!!!!"
                }
            }
        );

        // const newuser = await User.findOne({
        //     email:newemail
        // })

        const newusers = await User.find(
            {
                age:{
                    $gt:18
                }
            }
        ).lean();
        //returns an modified count 
        if(updatedUser.modifiedCount>0){
            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
                newUser: newusers
            });
        }

    }
    catch(err){
        console.error("Error updating user:", err);
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


router.put("/update", async (req, res)=>{
    try{
        //findOneAndUpdate -> find a user and update it

        const { email, newemail } = req.body; //extracting email from the request body

        const updatedUser = await User.findOneAndUpdate(
            {
                //matching condition
                email:email //find the user with the given email
            },
            {
                $set:{
                    email:newemail //update the email to the new email
                }
            },
            {
                //optional 
                upsert: true, //if the user does not exist, create a new user with the given email
                runValidators: true, //run the validators on the updated fields
                new: true //return the updated user
            }
        )
        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        })
    }
    catch(err){
        console.error("Error updating user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})


router.put("/updatebyid/:id", async (req, res)=>{
    try{
        //whenever you use id, it is always preferred to use id through route params
        const id = req.params.id; //extracting id from the request params
        
        const { newemail, name } = req.body; //extracting new email and name from the request body

        const updatedUser = await User.findByIdAndUpdate(
            id, //this is the user's id
            {
                $set:{
                    email:newemail,
                    name:name
                }
            },
            {
                upsert: true, //if the user does not exist, create a new user with the given email
                runValidators: true, //run the validators on the updated fields
                new: true //return the updated user
            }
        )
        if(!updatedUser){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    }
    catch(err){
        console.error("Error updating user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
} )

router.put("/replace", async (req, res)=>{
    try{
        const { email, newemail, age, password, name, role } = req.body; //extracting email from the request body

        const result = await User.replaceOne(
            {
                email:email
            },
            {
                email:newemail,
                age:age,
                password:password,
                name:name,
                role:role
            },
            {
                upsert: true, //if the user does not exist, create a new user with the given email
                runValidators: true, //run the validators on the updated fields
            }
        )

        res.status(200).json({
            message: "User replaced successfully",
            data: result
        });
    }catch(err){
        console.error("Error replacing user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})


router.delete("/delete", async (req, res)=>{
    try{

        const {email } = req.body; //extracting email from the request body

        const deletedUser = await User.deleteOne({
            
            email:email //find the user with the given email
        })

        res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser
        });


    }catch(err){
        console.error("Error deleting user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})

router.get("/getAdults", async (req, res) => {
    try {
        const time = new Date();
        const oneMonthAgo = new Date(time.setMonth(time.getMonth()-1)); //get the date one month ago
        const users = await User.find({
            $and: [
                {
                    //adults
                    age: {
                        $gte: 18
                    }
                }, {
                    //role is admin
                    role: "admin"
                },
                {
                    createdAt:{
                        $gte: oneMonthAgo //users created in the last one month
                    }
                }
            ]
            //name and email 
        })
        .select("name email") //this will select only the name and email fields from the user collection

        if (!users) {

            res.json({ message: "no User with that role" })

        }

        res.json({ users: users, message: "Users fetched Successfully" })

    } catch (err) {

        console.log(err);

        res.json(500).json({ message: "Internal Server Error", error: err })

    }

})

router.get("/aggregate", async (req, res)=>{
    try{
        const data = await User.aggregate(
            [
                {
                    //match stage to filter users
                    $match:{
                        age:{
                            $gt: 18
                        }
                    }
                },
                {
                    //group stage to group users by any field 
                    $group:{
                        _id:"$role", //grouping by role
                        totalUsers: {
                            $sum:1 //counting the number of users in each group

                        },
                        averageAge:{
                            $avg:"$age" //calculating the average age of users in each group
                        }
                    
                    }
                },
                {
                    //project stage to reshape the output
                    //we can include or exclude fields from the output
                    $project:{
                        //first remove the _id field
                        _id:0, //0 means exclude the field
                        role:"$_id", //renaming _id to role
                        totalUsers:1, //include totalUsers field
                        averageAge:1 //include averageAge field
                    }
                }
            ]
        )
        res.status(200).json({
            message: "Aggregation successful",
            data: data
        });
    }
    catch(err){
        console.error("Error in aggregation:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})

router.get("/sorted", async (req, res)=>{
    try {
        const users = await User.aggregate(
            [
                {
                    $match:{
                        age:{
                            $gt:0
                        }
                    }
                },
            {
                $sort: {
                age: -1 //sort by age in descending order
                }
            }
            ]
        );

        res.status(200).json({
            message: "Sorted users fetched successfully",
            data: users
        });
        }
        catch (err) {
        console.error("Error fetching sorted users:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
        }
})

router.get("/limited/:limit", async (req, res)=>{
    try{
        const limit = parseInt(req.params.limit); //default limit is 10


        const users = await User.aggregate(
            [
                {
                    $match:{
                        age:{
                            $gt:0
                        }
                    }
                },
                {
                    $limit:limit //limit the number of users fetched
                }
                ,{
                    $skip:5
                }
            ]
        )
        res.status(200).json({
            message: "Limited users fetched successfully",
            data: users
        })
    }
    catch(err){
        console.error("Error fetching limited users:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})


router.get("/products/:page", async (req, res) => {
    try {
        const page = req.params.page;
        let skipNo = (page - 1) * 10;
        const users = await User.aggregate([
            { $skip: skipNo },
            { $limit: 10 }
        ]);
        if (!users) {
            res.json({ message: "no User Found" })
        }
 
        res.status(200).json({
            message: "Users fetched Successfully",
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", err: error })
    }
})

router.get("/", home)

module.exports = router;